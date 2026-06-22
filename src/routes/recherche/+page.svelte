<script lang="ts">
	import { getAllEntries } from '$lib/utils/content-loader';
	import { eras } from '$lib/data/eras';
	import { categories } from '$lib/data/categories';
	import type { LoreEntryFrontmatter, EraSlug, CategorySlug } from '$lib/types/lore';

	let query = $state('');
	let selectedEra = $state<EraSlug | ''>('');
	let selectedCategory = $state<CategorySlug | ''>('');

	const allEntries = getAllEntries();

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
	<title>Recherche — Grand Livre du Lore</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold tracking-tight text-text">
		Recherche
	</h1>

	<!-- Search input -->
	<div class="mb-6">
		<input
			type="search"
			bind:value={query}
			placeholder="Rechercher dans le lore..."
			class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
		/>
	</div>

	<!-- Filters -->
	<div class="mb-6 flex flex-wrap gap-3">
		<select
			bind:value={selectedEra}
			class="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary"
		>
			<option value="">Toutes les ères</option>
			{#each eras as era}
				<option value={era.slug}>{era.nameFr}</option>
			{/each}
		</select>

		<select
			bind:value={selectedCategory}
			class="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary"
		>
			<option value="">Toutes les catégories</option>
			{#each categories as cat}
				<option value={cat.slug}>{cat.icon} {cat.name}</option>
			{/each}
		</select>
	</div>

	<!-- Results -->
	<div class="mb-4 text-sm text-text-muted">
		{results.length} résultat{results.length !== 1 ? 's' : ''}
	</div>

	<ul class="flex flex-col gap-2">
		{#each results as entry}
			<li>
				<a
					href="/chronologie/{entry.era}/{entry.slug}"
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
			<p class="text-lg font-medium">Aucun résultat</p>
			<p class="mt-2 text-sm">Essayez un autre terme de recherche ou modifiez les filtres.</p>
		</div>
	{/if}
</div>
