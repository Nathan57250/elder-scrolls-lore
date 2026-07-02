<script lang="ts">
	import { categories, getCategoryName } from '$lib/data/categories';
	import { eras, getEraName } from '$lib/data/eras';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { page } from '$app/state';

	let { locale, collapsed = false }: { locale: Locale; collapsed?: boolean } = $props();
</script>

<nav class="flex flex-col gap-6" aria-label="Navigation">
	<div>
		<h3 class="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			{t(locale, 'nav.timeline')}
		</h3>
		<ul class="flex flex-col gap-0.5">
			{#each eras as era}
				<li>
					<a
						href={localePath(locale, 'timeline', era.slug)}
						class="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors {page.url.pathname.includes(era.slug) ? 'bg-surface-hover text-text' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
					>
						<span
							class="h-2 w-2 rounded-full"
							style="background-color: {era.color}"
						></span>
						{getEraName(era, locale)}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div>
		<h3 class="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			{t(locale, 'nav.categories')}
		</h3>
		<ul class="flex flex-col gap-0.5">
			{#each categories as category}
				<li>
					<a
						href={localePath(locale, 'categories', category.slug)}
						class="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors {page.url.pathname.includes(category.slug) ? 'bg-surface-hover text-text' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
					>
						<span class="text-base">{category.icon}</span>
						{getCategoryName(category, locale)}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div>
		<h3 class="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			{t(locale, 'nav.tags')}
		</h3>
		<a
			href={localePath(locale, 'tags')}
			class="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors {page.url.pathname.includes('/tags') || page.url.pathname.includes('/etiquetas') ? 'bg-surface-hover text-text' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
		>
			<span class="text-base">#</span>
			{t(locale, 'tags.title')}
		</a>
	</div>
</nav>
