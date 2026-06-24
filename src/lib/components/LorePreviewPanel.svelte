<script lang="ts">
	import { getPreviewState } from '$lib/stores/app-state.svelte';
	import { getEntryBySlug } from '$lib/utils/content-loader';
	import { getEra } from '$lib/data/eras';
	import { getCategory, getCategoryName } from '$lib/data/categories';
	import { getEraName } from '$lib/data/eras';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { page } from '$app/state';
	import { defaultLocale } from '$lib/i18n';

	const preview = getPreviewState();
	const locale = $derived((page.data?.locale as Locale) ?? defaultLocale);

	let entry = $derived(preview.slug ? getEntryBySlug(locale, preview.slug) : null);
	let metadata = $derived(entry?.metadata ?? null);
	let eraData = $derived(metadata ? getEra(metadata.era) : null);
	let categoryData = $derived(metadata ? getCategory(metadata.category) : null);
</script>

{#if preview.open && metadata}
	<!-- Backdrop -->
	<button
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:bg-black/30"
		onclick={() => preview.close()}
		aria-label={t(locale, 'preview.close')}
	></button>

	<!-- Panel -->
	<div class="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-bg shadow-2xl sm:w-[38%] sm:min-w-[360px]">
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-border px-5 py-4">
			<div class="min-w-0 flex-1">
				<div class="mb-1.5 flex flex-wrap items-center gap-2">
					{#if eraData}
						<span
							class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
							style="background-color: {eraData.color}15; color: {eraData.color}"
						>
							<span class="h-1.5 w-1.5 rounded-full" style="background-color: {eraData.color}"></span>
							{getEraName(eraData, locale)}
						</span>
					{/if}
					{#if categoryData}
						<span class="inline-flex items-center gap-1 rounded-full bg-bg-elevated px-2 py-0.5 text-xs font-medium text-text-secondary">
							{categoryData.icon} {getCategoryName(categoryData, locale)}
						</span>
					{/if}
				</div>
				<h3 class="truncate text-lg font-semibold text-text">
					{metadata.title}
				</h3>
			</div>
			<button
				onclick={() => preview.close()}
				class="ml-3 shrink-0 rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'preview.close')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Body -->
		<div class="flex-1 overflow-y-auto px-5 py-5">
			<p class="text-sm leading-relaxed text-text-secondary">
				{metadata.summary ?? metadata.description ?? ''}
			</p>

			{#if metadata.tags?.length}
				<div class="mt-5 flex flex-wrap gap-1.5">
					{#each metadata.tags as tag}
						<span class="rounded-md bg-bg-elevated px-2 py-0.5 text-xs text-text-muted">
							{tag}
						</span>
					{/each}
				</div>
			{/if}

			{#if metadata.date}
				<div class="mt-4 text-xs text-text-muted">
					{metadata.date}
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="border-t border-border px-5 py-4">
			<a
				href={localePath(locale, 'timeline', metadata.era, metadata.slug)}
				onclick={() => preview.close()}
				class="inline-flex items-center gap-1.5 rounded-md bg-accent-muted px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent-muted/80"
			>
				{t(locale, 'preview.read')}
			</a>
		</div>
	</div>
{/if}
