<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import type { LoreEntryFrontmatter } from '$lib/types/lore';
	import { getAllEntries } from '$lib/utils/content-loader';
	import { getEra } from '$lib/data/eras';

	let { locale }: { locale: Locale } = $props();

	const PROVINCES: Record<string, { x: number; y: number; color: string }> = {
		'Skyrim': { x: 0.45, y: 0.15, color: '#94a3b8' },
		'Cyrodiil': { x: 0.45, y: 0.45, color: '#fbbf24' },
		'Morrowind': { x: 0.7, y: 0.25, color: '#f87171' },
		'High Rock': { x: 0.2, y: 0.2, color: '#60a5fa' },
		'Hammerfell': { x: 0.2, y: 0.45, color: '#f59e0b' },
		'Valenwood': { x: 0.3, y: 0.7, color: '#34d399' },
		'Elsweyr': { x: 0.45, y: 0.75, color: '#fbbf24' },
		'Black Marsh': { x: 0.7, y: 0.55, color: '#6ee7b7' },
		'Summerset Isles': { x: 0.1, y: 0.8, color: '#c4b5fd' }
	};

	const allEntries = $derived(getAllEntries(locale));

	const mapArticles = $derived(
		allEntries.filter((e) => e.mapCoords || e.province)
	);

	let selectedProvince = $state<string | null>(null);

	const filteredArticles = $derived(
		selectedProvince
			? mapArticles.filter((e) => e.province === selectedProvince)
			: mapArticles
	);

	function getArticlePosition(entry: LoreEntryFrontmatter): { x: number; y: number } {
		if (entry.mapCoords) {
			return entry.mapCoords;
		}
		if (entry.province && PROVINCES[entry.province]) {
			const base = PROVINCES[entry.province];
			const hash = entry.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
			const offsetX = ((hash % 17) - 8) * 0.015;
			const offsetY = ((hash % 13) - 6) * 0.015;
			return { x: base.x + offsetX, y: base.y + offsetY };
		}
		return { x: 0.5, y: 0.5 };
	}

	function getMarkerColor(entry: LoreEntryFrontmatter): string {
		const era = getEra(entry.era);
		return era?.color ?? '#888';
	}

	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	let dragOffset = $state({ x: 0, y: 0 });

	let hoveredArticle = $state<LoreEntryFrontmatter | null>(null);
	let tooltipPos = $state({ x: 0, y: 0 });

	function zoomIn() {
		scale = Math.min(scale * 1.3, 5);
	}

	function zoomOut() {
		scale = Math.max(scale / 1.3, 0.5);
	}

	function resetView() {
		scale = 1;
		translateX = 0;
		translateY = 0;
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		if (e.deltaY < 0) {
			scale = Math.min(scale * 1.1, 5);
		} else {
			scale = Math.max(scale / 1.1, 0.5);
		}
	}

	function handlePointerDown(e: PointerEvent) {
		if ((e.target as HTMLElement).closest('.map-marker')) return;
		isDragging = true;
		dragStart = { x: e.clientX, y: e.clientY };
		dragOffset = { x: translateX, y: translateY };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		translateX = dragOffset.x + (e.clientX - dragStart.x);
		translateY = dragOffset.y + (e.clientY - dragStart.y);
	}

	function handlePointerUp() {
		isDragging = false;
	}

	function handleMarkerClick(entry: LoreEntryFrontmatter) {
		goto(localePath(locale, 'timeline', entry.era, entry.slug));
	}

	function handleMarkerEnter(e: MouseEvent, entry: LoreEntryFrontmatter) {
		hoveredArticle = entry;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		tooltipPos = { x: rect.left + rect.width / 2, y: rect.top - 8 };
	}

	function handleMarkerLeave() {
		hoveredArticle = null;
	}
</script>

<div class="flex h-[calc(100vh-4rem)] flex-col px-4 py-4">
	<header class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold tracking-tight text-text">
			{t(locale, 'map.title')}
		</h1>
		<div class="flex items-center gap-2">
			<button
				onclick={zoomIn}
				class="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'map.zoomIn')}
			>+</button>
			<button
				onclick={zoomOut}
				class="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'map.zoomOut')}
			>-</button>
			<button
				onclick={resetView}
				class="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-secondary hover:bg-surface-hover hover:text-text"
			>{t(locale, 'map.reset')}</button>
		</div>
	</header>

	<div class="flex min-h-0 flex-1 gap-4">
		<!-- Province filter sidebar -->
		<aside class="hidden w-56 flex-shrink-0 overflow-y-auto rounded-lg border border-border bg-surface p-3 md:block">
			<h2 class="mb-2 text-sm font-semibold text-text">{t(locale, 'map.filter')}</h2>
			<ul class="space-y-1">
				<li>
					<button
						class="w-full rounded px-2 py-1 text-left text-sm transition-colors {selectedProvince === null ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
						onclick={() => selectedProvince = null}
					>
						{t(locale, 'map.allProvinces')}
						<span class="ml-1 text-xs opacity-60">({mapArticles.length})</span>
					</button>
				</li>
				{#each Object.keys(PROVINCES) as province}
					{@const count = mapArticles.filter(e => e.province === province).length}
					<li>
						<button
							class="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors {selectedProvince === province ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
							onclick={() => selectedProvince = selectedProvince === province ? null : province}
						>
							<span
								class="inline-block h-2.5 w-2.5 rounded-full"
								style="background-color: {PROVINCES[province].color}"
							></span>
							{province}
							{#if count > 0}
								<span class="ml-auto text-xs opacity-60">({count})</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</aside>

		<!-- Map area -->
		<div
			class="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-surface"
			role="application"
			aria-label={t(locale, 'map.title')}
			onwheel={handleWheel}
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			style="cursor: {isDragging ? 'grabbing' : 'grab'}"
		>
			<div
				class="absolute inset-0 origin-center"
				style="transform: translate({translateX}px, {translateY}px) scale({scale})"
			>
				<!-- SVG Map of Tamriel -->
				<svg
					viewBox="0 0 1000 800"
					class="h-full w-full"
					xmlns="http://www.w3.org/2000/svg"
				>
					<!-- Background sea -->
					<rect width="1000" height="800" fill="var(--color-bg, #1a1a2e)" />

					<!-- Summerset Isles -->
					<path
						d="M60 580 L100 560 L140 570 L150 620 L130 670 L90 680 L60 650 Z"
						fill={PROVINCES['Summerset Isles'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Summerset Isles'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="100" y="625" text-anchor="middle" font-size="11" fill={PROVINCES['Summerset Isles'].color} opacity="0.8">Summerset</text>

					<!-- Valenwood -->
					<path
						d="M200 500 L300 480 L340 520 L330 580 L290 620 L230 610 L190 570 Z"
						fill={PROVINCES['Valenwood'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Valenwood'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="270" y="555" text-anchor="middle" font-size="12" fill={PROVINCES['Valenwood'].color} opacity="0.8">Valenwood</text>

					<!-- Elsweyr -->
					<path
						d="M340 520 L460 510 L500 560 L480 620 L400 640 L330 580 Z"
						fill={PROVINCES['Elsweyr'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Elsweyr'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="420" y="580" text-anchor="middle" font-size="12" fill={PROVINCES['Elsweyr'].color} opacity="0.8">Elsweyr</text>

					<!-- Hammerfell -->
					<path
						d="M100 280 L200 250 L280 280 L300 350 L280 400 L200 420 L140 380 L100 320 Z"
						fill={PROVINCES['Hammerfell'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Hammerfell'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="200" y="345" text-anchor="middle" font-size="12" fill={PROVINCES['Hammerfell'].color} opacity="0.8">Hammerfell</text>

					<!-- High Rock -->
					<path
						d="M100 140 L200 120 L270 150 L280 200 L250 250 L180 260 L100 230 L80 180 Z"
						fill={PROVINCES['High Rock'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['High Rock'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="180" y="195" text-anchor="middle" font-size="12" fill={PROVINCES['High Rock'].color} opacity="0.8">High Rock</text>

					<!-- Skyrim -->
					<path
						d="M300 60 L450 50 L550 80 L580 140 L560 200 L480 230 L380 220 L300 180 L280 120 Z"
						fill={PROVINCES['Skyrim'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Skyrim'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="430" y="145" text-anchor="middle" font-size="13" fill={PROVINCES['Skyrim'].color} opacity="0.8">Skyrim</text>

					<!-- Cyrodiil -->
					<path
						d="M300 280 L460 260 L540 300 L560 380 L520 450 L430 480 L340 460 L280 400 L270 330 Z"
						fill={PROVINCES['Cyrodiil'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Cyrodiil'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="420" y="375" text-anchor="middle" font-size="13" fill={PROVINCES['Cyrodiil'].color} opacity="0.8">Cyrodiil</text>

					<!-- Morrowind -->
					<path
						d="M580 100 L700 80 L780 120 L790 200 L750 260 L670 270 L600 240 L570 180 Z"
						fill={PROVINCES['Morrowind'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Morrowind'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="690" y="180" text-anchor="middle" font-size="12" fill={PROVINCES['Morrowind'].color} opacity="0.8">Morrowind</text>

					<!-- Black Marsh -->
					<path
						d="M580 320 L700 290 L780 340 L790 420 L740 470 L650 480 L580 440 L560 380 Z"
						fill={PROVINCES['Black Marsh'].color}
						fill-opacity="0.25"
						stroke={PROVINCES['Black Marsh'].color}
						stroke-opacity="0.6"
						stroke-width="1.5"
					/>
					<text x="680" y="390" text-anchor="middle" font-size="12" fill={PROVINCES['Black Marsh'].color} opacity="0.8">Black Marsh</text>
				</svg>

				<!-- Article markers (positioned over SVG using percentages) -->
				{#each filteredArticles as entry (entry.slug)}
					{@const pos = getArticlePosition(entry)}
					<button
						class="map-marker absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg shadow-lg transition-transform hover:scale-150 hover:z-50"
						style="left: {pos.x * 100}%; top: {pos.y * 100}%; background-color: {getMarkerColor(entry)}; width: {10 / scale}px; height: {10 / scale}px; border-width: {2 / scale}px;"
						onclick={() => handleMarkerClick(entry)}
						onmouseenter={(e) => handleMarkerEnter(e, entry)}
						onmouseleave={handleMarkerLeave}
						aria-label={entry.title}
						title={entry.title}
					></button>
				{/each}
			</div>

			<!-- Empty state -->
			{#if filteredArticles.length === 0}
				<div class="absolute inset-0 flex items-center justify-center">
					<p class="rounded-lg bg-surface/80 px-4 py-2 text-sm text-text-secondary backdrop-blur-sm">
						{t(locale, 'map.noArticles')}
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Tooltip (rendered outside map container for correct positioning) -->
{#if hoveredArticle}
	<div
		class="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text shadow-xl"
		style="left: {tooltipPos.x}px; top: {tooltipPos.y}px;"
	>
		<span class="font-medium">{hoveredArticle.title}</span>
		{#if hoveredArticle.province}
			<span class="ml-2 text-xs text-text-secondary">({hoveredArticle.province})</span>
		{/if}
	</div>
{/if}
