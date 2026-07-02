<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Locale } from '$lib/i18n';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import { eras, getEraName } from '$lib/data/eras';
	import { getAllEntries } from '$lib/utils/content-loader';
	import type { LoreEntryFrontmatter, EraSlug } from '$lib/types/lore';

	let { locale }: { locale: Locale } = $props();

	const allEntries = $derived(getAllEntries(locale));

	// Group entries by era
	const entriesByEra = $derived.by(() => {
		const map = new Map<EraSlug, LoreEntryFrontmatter[]>();
		for (const era of eras) {
			map.set(era.slug, []);
		}
		for (const entry of allEntries) {
			const arr = map.get(entry.era);
			if (arr) arr.push(entry);
		}
		// Sort entries within each era: those with timelineYear first (sorted), then those without
		for (const [, entries] of map) {
			entries.sort((a, b) => {
				const aYear = a.timelineYear ?? -Infinity;
				const bYear = b.timelineYear ?? -Infinity;
				if (aYear === -Infinity && bYear === -Infinity) return a.title.localeCompare(b.title);
				if (aYear === -Infinity) return -1;
				if (bYear === -Infinity) return -1;
				return aYear - bYear;
			});
		}
		return map;
	});

	// Zoom state
	let zoom = $state(1);
	const MIN_ZOOM = 0.5;
	const MAX_ZOOM = 3;
	const BASE_ERA_WIDTH = 300;

	function zoomIn() {
		zoom = Math.min(MAX_ZOOM, zoom + 0.25);
	}

	function zoomOut() {
		zoom = Math.max(MIN_ZOOM, zoom - 0.25);
	}

	// Scroll container ref
	let scrollContainer: HTMLDivElement | undefined = $state();
	let containerWidth = $state(0);
	let scrollLeft = $state(0);
	let totalWidth = $state(0);

	// Minimap viewport
	const minimapViewportWidth = $derived(
		totalWidth > 0 ? Math.min(1, containerWidth / totalWidth) * 100 : 100
	);
	const minimapViewportLeft = $derived(
		totalWidth > 0 ? (scrollLeft / totalWidth) * 100 : 0
	);

	// Tooltip state
	let hoveredEntry = $state<LoreEntryFrontmatter | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	function handleWheel(e: WheelEvent) {
		if (!scrollContainer) return;
		e.preventDefault();
		scrollContainer.scrollLeft += e.deltaY + e.deltaX;
	}

	function handleScroll() {
		if (!scrollContainer) return;
		scrollLeft = scrollContainer.scrollLeft;
		totalWidth = scrollContainer.scrollWidth;
		containerWidth = scrollContainer.clientWidth;
	}

	function handleMinimapClick(e: MouseEvent) {
		if (!scrollContainer) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const ratio = (e.clientX - rect.left) / rect.width;
		scrollContainer.scrollLeft = ratio * scrollContainer.scrollWidth - scrollContainer.clientWidth / 2;
	}

	function showTooltip(entry: LoreEntryFrontmatter, event: MouseEvent) {
		hoveredEntry = entry;
		tooltipX = event.clientX;
		tooltipY = event.clientY;
	}

	function hideTooltip() {
		hoveredEntry = null;
	}

	function navigateToEntry(entry: LoreEntryFrontmatter) {
		goto(localePath(locale, 'timeline', entry.era, entry.slug));
	}

	onMount(() => {
		if (scrollContainer) {
			totalWidth = scrollContainer.scrollWidth;
			containerWidth = scrollContainer.clientWidth;
		}
	});

	// Update measurements when zoom changes
	$effect(() => {
		// Reference zoom to trigger this effect
		void zoom;
		// Use a microtask to wait for DOM update
		queueMicrotask(() => {
			if (scrollContainer) {
				totalWidth = scrollContainer.scrollWidth;
				containerWidth = scrollContainer.clientWidth;
			}
		});
	});
</script>

<div class="flex h-[calc(100vh-4rem)] flex-col">
	<!-- Header with title and zoom controls -->
	<div class="flex items-center justify-between border-b border-border px-4 py-3">
		<h1 class="text-2xl font-bold tracking-tight text-text">
			{t(locale, 'timeline.visual.title')}
		</h1>
		<div class="flex items-center gap-2">
			<button
				onclick={zoomOut}
				disabled={zoom <= MIN_ZOOM}
				class="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
				aria-label={t(locale, 'timeline.visual.zoom_out')}
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
				</svg>
			</button>
			<span class="min-w-[3rem] text-center text-sm text-text-secondary">{Math.round(zoom * 100)}%</span>
			<button
				onclick={zoomIn}
				disabled={zoom >= MAX_ZOOM}
				class="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
				aria-label={t(locale, 'timeline.visual.zoom_in')}
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Minimap / Overview bar -->
	<div class="border-b border-border bg-bg px-4 py-2">
		<button
			class="relative mx-auto flex h-8 w-full max-w-4xl cursor-pointer overflow-hidden rounded border border-border bg-surface"
			onclick={handleMinimapClick}
			aria-label="Timeline minimap"
		>
			{#each eras as era}
				<div
					class="h-full"
					style="width: {100 / eras.length}%; background-color: {era.color}30;"
				>
					<span class="flex h-full items-center justify-center text-[9px] font-medium truncate px-0.5" style="color: {era.color}">
						{getEraName(era, locale)}
					</span>
				</div>
			{/each}
			<!-- Viewport indicator -->
			<div
				class="pointer-events-none absolute top-0 h-full rounded border-2 border-accent/70 bg-accent/10"
				style="left: {minimapViewportLeft}%; width: {minimapViewportWidth}%;"
			></div>
		</button>
	</div>

	<!-- Main scrollable timeline -->
	<div
		class="flex-1 overflow-x-auto overflow-y-hidden"
		bind:this={scrollContainer}
		onwheel={handleWheel}
		onscroll={handleScroll}
	>
		<div class="relative h-full min-h-[400px]" style="width: {eras.length * BASE_ERA_WIDTH * zoom}px;">
			<!-- Era sections -->
			<div class="flex h-full">
				{#each eras as era, eraIndex}
					{@const eraEntries = entriesByEra.get(era.slug) ?? []}
					<div
						class="relative flex h-full flex-col border-r border-border/50"
						style="width: {BASE_ERA_WIDTH * zoom}px; background-color: {era.color}08;"
					>
						<!-- Era header -->
						<div
							class="sticky top-0 z-10 border-b px-2 py-2 text-center"
							style="border-color: {era.color}40; background-color: {era.color}15;"
						>
							<span class="text-xs font-semibold" style="color: {era.color}">
								{getEraName(era, locale)}
							</span>
							{#if era.startYear !== null && era.endYear !== null}
								<div class="text-[10px] text-text-secondary">
									{era.startYear} — {era.endYear}
								</div>
							{/if}
						</div>

						<!-- Timeline axis line -->
						<div class="absolute left-0 right-0 top-1/2 h-px" style="background-color: {era.color}40;"></div>

						<!-- Entry dots -->
						<div class="relative flex-1 px-1 py-2">
							{#each eraEntries as entry, entryIndex}
								{@const hasYear = entry.timelineYear !== undefined}
								{@const totalEntries = eraEntries.length}
								{@const xPos = hasYear && era.startYear !== null && era.endYear !== null
									? ((entry.timelineYear! - era.startYear) / (era.endYear - era.startYear)) * 100
									: ((entryIndex + 1) / (totalEntries + 1)) * 100}
								{@const yOffset = (entryIndex % 5) * 20 - 40}
								<button
									class="group absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg transition-all duration-150 hover:scale-150 hover:z-20"
									style="left: {Math.max(5, Math.min(95, xPos))}%; top: calc(50% + {yOffset}px); background-color: {era.color};"
									onmouseenter={(e) => showTooltip(entry, e)}
									onmouseleave={hideTooltip}
									onclick={() => navigateToEntry(entry)}
									aria-label={entry.title}
								>
									{#if !hasYear}
										<span class="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] text-text-secondary opacity-0 group-hover:opacity-100">?</span>
									{/if}
								</button>
							{/each}

							{#if eraEntries.length === 0}
								<div class="flex h-full items-center justify-center">
									<span class="text-xs text-text-muted italic">{t(locale, 'timeline.empty')}</span>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Tooltip -->
	{#if hoveredEntry}
		{@const hoveredEra = eras.find(e => e.slug === hoveredEntry.era)}
		<div
			class="pointer-events-none fixed z-50 max-w-xs rounded-lg border border-border bg-bg-elevated px-3 py-2 shadow-lg"
			style="left: {tooltipX + 12}px; top: {tooltipY - 10}px; transform: translateY(-100%);"
		>
			<p class="text-sm font-semibold text-text">{hoveredEntry.title}</p>
			{#if hoveredEntry.timelineYear !== undefined && hoveredEra}
				<p class="text-xs text-text-secondary">
					{getEraName(hoveredEra, locale)} — {hoveredEntry.timelineYear}
				</p>
			{:else if hoveredEra}
				<p class="text-xs text-text-secondary">
					{getEraName(hoveredEra, locale)} — {t(locale, 'timeline.visual.no_year')}
				</p>
			{/if}
			{#if hoveredEntry.summary || hoveredEntry.description}
				<p class="mt-1 line-clamp-2 text-xs text-text-secondary">
					{hoveredEntry.summary ?? hoveredEntry.description}
				</p>
			{/if}
		</div>
	{/if}
</div>
