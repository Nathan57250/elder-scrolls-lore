<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { LoreEntryFrontmatter } from '$lib/types/lore';
	import { getEra, getEraName } from '$lib/data/eras';
	import { getCategory, getCategoryName } from '$lib/data/categories';
	import { getBookModeState, getPreviewState } from '$lib/stores/app-state.svelte';
	import { getReadingProgressState } from '$lib/stores/reading-progress.svelte';
	import { findEntity } from '$lib/utils/entity-lookup';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { page } from '$app/state';
	import { defaultLocale } from '$lib/i18n';
	import RelatedArticles from './RelatedArticles.svelte';
	import TableOfContents from './TableOfContents.svelte';
	import type { Snippet } from 'svelte';

	let { title, slug, era, category, tags, date, summary, sources, relatedArticles, children }: LoreEntryFrontmatter & { children: Snippet } = $props();

	const locale = $derived((page.data?.locale as Locale) ?? defaultLocale);
	const bookMode = getBookModeState();
	const preview = getPreviewState();
	const readingProgress = getReadingProgressState();
	const eraData = $derived(getEra(era));
	const categoryData = $derived(getCategory(category));

	let contentEl: HTMLDivElement;
	let scrollPercent = $state(0);
	let scrollRaf: number | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function calculateScrollProgress() {
		if (!contentEl) return;
		const rect = contentEl.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const contentTop = rect.top + window.scrollY;
		const contentHeight = rect.height;

		if (contentHeight <= 0) return;

		const scrolled = window.scrollY - contentTop + viewportHeight;
		const totalScrollable = contentHeight + viewportHeight;
		const percent = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));

		scrollPercent = percent;

		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			readingProgress.setProgress(slug, percent);
		}, 300);
	}

	function handleScroll() {
		if (scrollRaf) return;
		scrollRaf = requestAnimationFrame(() => {
			calculateScrollProgress();
			scrollRaf = null;
		});
	}

	onMount(() => {
		readingProgress.init();
		scrollPercent = readingProgress.getProgress(slug);
		window.addEventListener('scroll', handleScroll, { passive: true });
		calculateScrollProgress();

		const strongs = contentEl.querySelectorAll('strong');
		for (const el of strongs) {
			const text = el.textContent?.trim();
			if (!text) continue;
			const entity = findEntity(locale, text);
			if (entity && entity.metadata.slug !== slug) {
				el.classList.add('entity-link');
				el.dataset.slug = entity.metadata.slug;
			}
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
		if (scrollRaf) cancelAnimationFrame(scrollRaf);
		if (debounceTimer) clearTimeout(debounceTimer);
	});

	function handleContentClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const strong = target.closest('.entity-link') as HTMLElement;
		if (strong?.dataset.slug) {
			e.preventDefault();
			preview.show(strong.dataset.slug);
		}
	}
</script>

{#if scrollPercent > 0}
	<div
		class="fixed left-0 top-0 z-50 h-0.5 transition-[width] duration-150 ease-out"
		style="width: {scrollPercent}%; background-color: var(--color-accent);"
		aria-hidden="true"
	></div>
{/if}

<div class="relative mx-auto max-w-3xl px-4 xl:max-w-none xl:px-0">
	<article
		class="mx-auto max-w-3xl px-0 py-10 xl:px-4 {bookMode.active ? 'max-w-2xl text-lg leading-relaxed' : ''}"
		data-pagefind-body
	>
		<header class="mb-10 border-b border-border pb-6">
			<div class="mb-3 flex flex-wrap items-center gap-2">
				{#if eraData}
					<a
						href={localePath(locale, 'timeline', era)}
						class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium no-underline"
						style="background-color: {eraData.color}15; color: {eraData.color}"
						data-pagefind-filter="era"
					>
						<span class="h-1.5 w-1.5 rounded-full" style="background-color: {eraData.color}"></span>
						{getEraName(eraData, locale)}
					</a>
				{/if}
				{#if categoryData}
					<a
						href={localePath(locale, 'categories', category)}
						class="inline-flex items-center gap-1 rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary no-underline"
						data-pagefind-filter="category"
					>
						{categoryData.icon} {getCategoryName(categoryData, locale)}
					</a>
				{/if}
				{#if date}
					<span class="text-xs text-text-muted">{date}</span>
				{/if}
			</div>

			<h1 class="text-3xl font-bold tracking-tight text-text" data-pagefind-meta="title">
				{title}
			</h1>

			<p class="mt-3 text-base text-text-secondary">{summary}</p>

			{#if tags?.length}
				<div class="mt-4 flex flex-wrap gap-1.5">
					{#each tags as tag}
						<span
							class="rounded-md bg-bg-elevated px-2 py-0.5 text-xs text-text-muted"
							data-pagefind-filter="tag"
						>
							{tag}
						</span>
					{/each}
				</div>
			{/if}

			<div class="mt-4">
				<a
					href="{localePath(locale, 'graph')}?focus={slug}"
					class="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary no-underline transition-colors hover:border-border-subtle hover:bg-surface-hover hover:text-text"
				>
					<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<circle cx="6" cy="6" r="2.5" stroke-width="2" />
						<circle cx="18" cy="6" r="2.5" stroke-width="2" />
						<circle cx="12" cy="18" r="2.5" stroke-width="2" />
						<path stroke-width="1.5" d="M8 7.5l4 8M16 7.5l-4 8" />
					</svg>
					{t(locale, 'graph.see_relations')}
				</a>
			</div>
		</header>

		<div class="mb-6 xl:hidden">
			<TableOfContents {locale} collapsible />
		</div>

		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="lore-content" role="presentation" bind:this={contentEl} onclick={handleContentClick}>
			{@render children()}
		</div>

		{#if sources?.length}
			<footer class="mt-12 border-t border-border pt-6">
				<h3 class="text-xs font-medium uppercase tracking-wider text-text-muted">
					{t(locale, 'article.sources')}
				</h3>
				<ul class="mt-2 list-none p-0">
					{#each sources as source}
						<li class="text-sm text-text-secondary">{source}</li>
					{/each}
				</ul>
			</footer>
		{/if}
	</article>

	<aside class="absolute left-full top-10 ml-8 hidden w-56 xl:block">
		<div class="sticky top-24">
			<TableOfContents {locale} />
		</div>
	</aside>
</div>

<style>
	.lore-content :global(h2) {
		font-size: 1.375rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		color: var(--color-text);
		letter-spacing: -0.01em;
	}

	.lore-content :global(h3) {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		color: var(--color-text);
	}

	.lore-content :global(p) {
		margin-bottom: 1rem;
		line-height: 1.75;
		color: var(--color-text-secondary);
	}

	.lore-content :global(ul),
	.lore-content :global(ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
		color: var(--color-text-secondary);
	}

	.lore-content :global(li) {
		margin-bottom: 0.4rem;
		line-height: 1.7;
	}

	.lore-content :global(strong) {
		font-weight: 600;
		color: var(--color-text);
	}

	.lore-content :global(em) {
		font-style: italic;
	}

	.lore-content :global(blockquote) {
		border-left: 2px solid var(--color-accent);
		padding-left: 1rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: var(--color-text-secondary);
	}

	.lore-content :global(a) {
		color: var(--color-accent);
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: var(--color-accent-muted);
	}

	.lore-content :global(a:hover) {
		color: var(--color-accent-hover);
		text-decoration-color: var(--color-accent);
	}

	.lore-content :global(.entity-link) {
		cursor: pointer;
		text-decoration: underline;
		text-decoration-style: dotted;
		text-underline-offset: 3px;
		text-decoration-color: var(--color-accent-muted);
		transition: color 0.15s, text-decoration-color 0.15s;
	}

	.lore-content :global(.entity-link:hover) {
		color: var(--color-accent);
		text-decoration-color: var(--color-accent);
	}

	.lore-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.875rem;
	}

	.lore-content :global(th),
	.lore-content :global(td) {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		text-align: left;
		color: var(--color-text-secondary);
	}

	.lore-content :global(th) {
		font-weight: 600;
		background-color: var(--color-bg-elevated);
		color: var(--color-text);
	}
</style>
