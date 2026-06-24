<script lang="ts">
	import { onMount } from 'svelte';
	import type { LoreEntryFrontmatter } from '$lib/types/lore';
	import { getEra, getEraName } from '$lib/data/eras';
	import { getCategory, getCategoryName } from '$lib/data/categories';
	import { getBookModeState, getPreviewState } from '$lib/stores/app-state.svelte';
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
	const eraData = $derived(getEra(era));
	const categoryData = $derived(getCategory(category));

	let contentEl: HTMLDivElement;

	onMount(() => {
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

	function handleContentClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const strong = target.closest('.entity-link') as HTMLElement;
		if (strong?.dataset.slug) {
			e.preventDefault();
			preview.show(strong.dataset.slug);
		}
	}
</script>

<article
	class="mx-auto max-w-3xl px-4 py-10 {bookMode.active ? 'max-w-2xl text-lg leading-relaxed' : ''}"
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
	</header>

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
