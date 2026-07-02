<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getAllEntries, getEntryBySlug } from '$lib/utils/content-loader';
	import { eras, getEraName } from '$lib/data/eras';
	import { getCategory, getCategoryName } from '$lib/data/categories';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import type { EraSlug } from '$lib/types/lore';

	let { locale }: { locale: Locale } = $props();

	const allEntries = $derived(getAllEntries(locale));

	// Read slugs from URL query params
	const leftSlug = $derived(page.url.searchParams.get('left') ?? '');
	const rightSlug = $derived(page.url.searchParams.get('right') ?? '');

	// Load selected entries
	const leftEntry = $derived(leftSlug ? getEntryBySlug(locale, leftSlug) : null);
	const rightEntry = $derived(rightSlug ? getEntryBySlug(locale, rightSlug) : null);

	// Search states
	let leftSearch = $state('');
	let rightSearch = $state('');
	let leftDropdownOpen = $state(false);
	let rightDropdownOpen = $state(false);

	// Filtered entries for dropdowns
	const leftFiltered = $derived.by(() => {
		if (!leftSearch) return allEntries;
		const q = leftSearch.toLowerCase();
		return allEntries.filter((e) => e.title.toLowerCase().includes(q));
	});

	const rightFiltered = $derived.by(() => {
		if (!rightSearch) return allEntries;
		const q = rightSearch.toLowerCase();
		return allEntries.filter((e) => e.title.toLowerCase().includes(q));
	});

	// Comparison data
	const sharedTags = $derived.by(() => {
		if (!leftEntry || !rightEntry) return [];
		const leftTags = leftEntry.metadata.tags ?? [];
		const rightTags = rightEntry.metadata.tags ?? [];
		return leftTags.filter((tag) => rightTags.includes(tag));
	});

	const sharedRelations = $derived.by(() => {
		if (!leftEntry || !rightEntry) return [];
		const leftRels = leftEntry.metadata.relatedArticles ?? [];
		const rightRels = rightEntry.metadata.relatedArticles ?? [];
		return leftRels.filter((rel) => rightRels.includes(rel));
	});

	const sameEra = $derived(
		leftEntry && rightEntry ? leftEntry.metadata.era === rightEntry.metadata.era : false
	);

	function selectArticle(side: 'left' | 'right', slug: string) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set(side, slug);
		goto(`${page.url.pathname}?${params.toString()}`, { replaceState: true, keepFocus: true });

		if (side === 'left') {
			leftSearch = '';
			leftDropdownOpen = false;
		} else {
			rightSearch = '';
			rightDropdownOpen = false;
		}
	}

	function getEraForSlug(eraSlug: EraSlug) {
		return eras.find((e) => e.slug === eraSlug);
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold tracking-tight text-text">
		{t(locale, 'compare.title')}
	</h1>

	<!-- Comparison highlights -->
	{#if leftEntry && rightEntry}
		<div class="mb-6 flex flex-wrap gap-3">
			{#if sameEra}
				<span class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
					<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
					{getEraName(getEraForSlug(leftEntry.metadata.era)!, locale)}
				</span>
			{/if}
			{#if sharedTags.length > 0}
				<span class="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
					{t(locale, 'compare.sharedTags')}: {sharedTags.length}
				</span>
			{/if}
			{#if sharedRelations.length > 0}
				<span class="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
					{t(locale, 'compare.sharedRelations')}: {sharedRelations.length}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Two column layout -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Left column -->
		<div class="flex flex-col gap-4">
			<h2 class="text-sm font-medium uppercase tracking-wider text-text-muted">
				{t(locale, 'compare.left')}
			</h2>

			<!-- Article selector -->
			<div class="relative">
				<input
					type="text"
					bind:value={leftSearch}
					onfocus={() => (leftDropdownOpen = true)}
					onblur={() => setTimeout(() => (leftDropdownOpen = false), 200)}
					placeholder={leftEntry ? leftEntry.metadata.title : t(locale, 'compare.search')}
					class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
				/>
				{#if leftDropdownOpen}
					<div class="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-bg-elevated shadow-lg">
						{#each eras as era}
							{@const eraEntries = leftFiltered.filter((e) => e.era === era.slug)}
							{#if eraEntries.length > 0}
								<div class="sticky top-0 border-b border-border bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted">
									{getEraName(era, locale)}
								</div>
								{#each eraEntries as entry}
									<button
										type="button"
										class="w-full px-3 py-2 text-left text-sm text-text hover:bg-surface-hover {entry.slug === leftSlug ? 'bg-accent/10 text-accent' : ''}"
										onmousedown={() => selectArticle('left', entry.slug)}
									>
										{entry.title}
									</button>
								{/each}
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<!-- Left article content -->
			{#if leftEntry}
				{@const eraData = getEraForSlug(leftEntry.metadata.era)}
				{@const catData = getCategory(leftEntry.metadata.category)}
				{@const LeftComponent = leftEntry.component}
				<div class="rounded-lg border border-border bg-surface p-4">
					<!-- Metadata -->
					<div class="mb-4 flex flex-wrap items-center gap-2">
						{#if eraData}
							<span
								class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
								style="background-color: {eraData.color}15; color: {eraData.color}"
							>
								<span class="h-1.5 w-1.5 rounded-full" style="background-color: {eraData.color}"></span>
								{getEraName(eraData, locale)}
							</span>
						{/if}
						{#if catData}
							<span class="inline-flex items-center gap-1 rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary">
								{catData.icon} {getCategoryName(catData, locale)}
							</span>
						{/if}
					</div>

					<h3 class="mb-2 text-lg font-semibold text-text">{leftEntry.metadata.title}</h3>

					{#if leftEntry.metadata.summary}
						<p class="mb-3 text-sm text-text-secondary">{leftEntry.metadata.summary}</p>
					{/if}

					<!-- Tags -->
					{#if leftEntry.metadata.tags?.length}
						<div class="mb-4 flex flex-wrap gap-1.5">
							{#each leftEntry.metadata.tags as tag}
								<span
									class="rounded-md px-2 py-0.5 text-xs {sharedTags.includes(tag) ? 'bg-accent/15 text-accent font-medium' : 'bg-bg-elevated text-text-muted'}"
								>
									{tag}
								</span>
							{/each}
						</div>
					{/if}

					<!-- Rendered content -->
					<div class="lore-content border-t border-border pt-4">
						{#if LeftComponent}
							<LeftComponent />
						{/if}
					</div>

					<!-- Link to full article -->
					<div class="mt-4 border-t border-border pt-3">
						<a
							href={localePath(locale, 'timeline', leftEntry.metadata.era, leftEntry.metadata.slug)}
							class="text-sm text-accent hover:underline"
						>
							{t(locale, 'article.read_more')}
						</a>
					</div>
				</div>
			{:else}
				<div class="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-surface p-8">
					<p class="text-sm text-text-muted">{t(locale, 'compare.select')}</p>
				</div>
			{/if}
		</div>

		<!-- Right column -->
		<div class="flex flex-col gap-4">
			<h2 class="text-sm font-medium uppercase tracking-wider text-text-muted">
				{t(locale, 'compare.right')}
			</h2>

			<!-- Article selector -->
			<div class="relative">
				<input
					type="text"
					bind:value={rightSearch}
					onfocus={() => (rightDropdownOpen = true)}
					onblur={() => setTimeout(() => (rightDropdownOpen = false), 200)}
					placeholder={rightEntry ? rightEntry.metadata.title : t(locale, 'compare.search')}
					class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
				/>
				{#if rightDropdownOpen}
					<div class="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-bg-elevated shadow-lg">
						{#each eras as era}
							{@const eraEntries = rightFiltered.filter((e) => e.era === era.slug)}
							{#if eraEntries.length > 0}
								<div class="sticky top-0 border-b border-border bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted">
									{getEraName(era, locale)}
								</div>
								{#each eraEntries as entry}
									<button
										type="button"
										class="w-full px-3 py-2 text-left text-sm text-text hover:bg-surface-hover {entry.slug === rightSlug ? 'bg-accent/10 text-accent' : ''}"
										onmousedown={() => selectArticle('right', entry.slug)}
									>
										{entry.title}
									</button>
								{/each}
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<!-- Right article content -->
			{#if rightEntry}
				{@const eraData = getEraForSlug(rightEntry.metadata.era)}
				{@const catData = getCategory(rightEntry.metadata.category)}
				{@const RightComponent = rightEntry.component}
				<div class="rounded-lg border border-border bg-surface p-4">
					<!-- Metadata -->
					<div class="mb-4 flex flex-wrap items-center gap-2">
						{#if eraData}
							<span
								class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
								style="background-color: {eraData.color}15; color: {eraData.color}"
							>
								<span class="h-1.5 w-1.5 rounded-full" style="background-color: {eraData.color}"></span>
								{getEraName(eraData, locale)}
							</span>
						{/if}
						{#if catData}
							<span class="inline-flex items-center gap-1 rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary">
								{catData.icon} {getCategoryName(catData, locale)}
							</span>
						{/if}
					</div>

					<h3 class="mb-2 text-lg font-semibold text-text">{rightEntry.metadata.title}</h3>

					{#if rightEntry.metadata.summary}
						<p class="mb-3 text-sm text-text-secondary">{rightEntry.metadata.summary}</p>
					{/if}

					<!-- Tags -->
					{#if rightEntry.metadata.tags?.length}
						<div class="mb-4 flex flex-wrap gap-1.5">
							{#each rightEntry.metadata.tags as tag}
								<span
									class="rounded-md px-2 py-0.5 text-xs {sharedTags.includes(tag) ? 'bg-accent/15 text-accent font-medium' : 'bg-bg-elevated text-text-muted'}"
								>
									{tag}
								</span>
							{/each}
						</div>
					{/if}

					<!-- Rendered content -->
					<div class="lore-content border-t border-border pt-4">
						{#if RightComponent}
							<RightComponent />
						{/if}
					</div>

					<!-- Link to full article -->
					<div class="mt-4 border-t border-border pt-3">
						<a
							href={localePath(locale, 'timeline', rightEntry.metadata.era, rightEntry.metadata.slug)}
							class="text-sm text-accent hover:underline"
						>
							{t(locale, 'article.read_more')}
						</a>
					</div>
				</div>
			{:else}
				<div class="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border bg-surface p-8">
					<p class="text-sm text-text-muted">{t(locale, 'compare.select')}</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Shared tags detail section -->
	{#if sharedTags.length > 0}
		<div class="mt-8 rounded-lg border border-border bg-surface p-4">
			<h3 class="mb-3 text-sm font-medium text-text">
				{t(locale, 'compare.sharedTags')}
			</h3>
			<div class="flex flex-wrap gap-2">
				{#each sharedTags as tag}
					<span class="rounded-md bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
						{tag}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Shared relations detail section -->
	{#if sharedRelations.length > 0}
		<div class="mt-4 rounded-lg border border-border bg-surface p-4">
			<h3 class="mb-3 text-sm font-medium text-text">
				{t(locale, 'compare.sharedRelations')}
			</h3>
			<div class="flex flex-wrap gap-2">
				{#each sharedRelations as rel}
					<a
						href={localePath(locale, 'timeline', leftEntry!.metadata.era, rel)}
						class="rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-600 hover:bg-purple-500/20 dark:text-purple-400"
					>
						{rel}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.lore-content :global(h2) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--color-text);
	}

	.lore-content :global(h3) {
		font-size: 1rem;
		font-weight: 600;
		margin-top: 1.25rem;
		margin-bottom: 0.4rem;
		color: var(--color-text);
	}

	.lore-content :global(p) {
		margin-bottom: 0.75rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.lore-content :global(ul),
	.lore-content :global(ol) {
		margin-bottom: 0.75rem;
		padding-left: 1.25rem;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.lore-content :global(li) {
		margin-bottom: 0.3rem;
		line-height: 1.6;
	}

	.lore-content :global(strong) {
		font-weight: 600;
		color: var(--color-text);
	}

	.lore-content :global(blockquote) {
		border-left: 2px solid var(--color-accent);
		padding-left: 0.75rem;
		margin: 1rem 0;
		font-style: italic;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

	.lore-content :global(a) {
		color: var(--color-accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
