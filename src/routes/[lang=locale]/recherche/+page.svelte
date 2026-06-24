<script lang="ts">
	import { getAllEntries } from '$lib/utils/content-loader';
	import { eras, getEraName } from '$lib/data/eras';
	import { categories, getCategoryName } from '$lib/data/categories';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { LoreEntryFrontmatter, EraSlug, CategorySlug } from '$lib/types/lore';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);

	let query = $state('');
	let selectedEra = $state<EraSlug | ''>('');
	let selectedCategory = $state<CategorySlug | ''>('');

	const allEntries = $derived(getAllEntries(locale));

	const results = $derived.by(() => {
		let filtered = allEntries;

		if (selectedEra) {
			filtered = filtered.filter((e) => e.era === selectedEra);
		}
		if (selectedCategory) {
			filtered = filtered.filter((e) => e.category === selectedCategory);
		}
		if (query.length >= 2) {
			const q = query.toLowerCase();
			filtered = filtered.filter(
				(e) =>
					e.title.toLowerCase().includes(q) ||
					(e.summary ?? e.description ?? '').toLowerCase().includes(q) ||
					e.tags?.some((t) => t.toLowerCase().includes(q))
			);
		}

		return filtered;
	});
</script>

<svelte:head>
	<title>{t(locale, 'search.title')} — {t(locale, 'site.title')}</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold tracking-tight text-text">
		{t(locale, 'search.title')}
	</h1>

	<!-- Search input -->
	<div class="mb-6">
		<input
			type="search"
			bind:value={query}
			placeholder={t(locale, 'search.placeholder')}
			class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
		/>
	</div>

	<!-- Filters -->
	<div class="mb-6 flex flex-wrap gap-3">
		<select
			bind:value={selectedEra}
			class="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary"
		>
			<option value="">{t(locale, 'search.all_eras')}</option>
			{#each eras as era}
				<option value={era.slug}>{getEraName(era, locale)}</option>
			{/each}
		</select>

		<select
			bind:value={selectedCategory}
			class="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary"
		>
			<option value="">{t(locale, 'search.all_categories')}</option>
			{#each categories as cat}
				<option value={cat.slug}>{cat.icon} {getCategoryName(cat, locale)}</option>
			{/each}
		</select>
	</div>

	<!-- Results -->
	<div class="mb-4 text-sm text-text-muted">
		{results.length} {t(locale, 'search.results', { count: results.length })}
	</div>

	<ul class="flex flex-col gap-2">
		{#each results as entry}
			<li>
				<a
					href={localePath(locale, 'timeline', entry.era, entry.slug)}
					class="block rounded-lg border border-border bg-surface p-4 transition-all hover:border-border-subtle hover:bg-surface-hover"
				>
					<h3 class="text-sm font-semibold text-text">
						{entry.title}
					</h3>
					<p class="mt-1 text-sm text-text-secondary">
						{entry.summary ?? entry.description ?? ''}
					</p>
					{#if entry.tags?.length}
						<div class="mt-2 flex flex-wrap gap-1">
							{#each entry.tags.slice(0, 5) as tag}
								<span class="rounded bg-bg-elevated px-1.5 py-0.5 text-xs text-text-muted">
									{tag}
								</span>
							{/each}
						</div>
					{/if}
				</a>
			</li>
		{/each}
	</ul>

	{#if results.length === 0}
		<div class="py-12 text-center text-text-muted">
			<p class="text-lg font-medium">{t(locale, 'search.empty')}</p>
			<p class="mt-2 text-sm">{t(locale, 'search.empty.hint')}</p>
		</div>
	{/if}
</div>
