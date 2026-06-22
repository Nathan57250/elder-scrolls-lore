<script lang="ts">
	import { categories } from '$lib/data/categories';
	import { eras } from '$lib/data/eras';
	import { page } from '$app/state';

	let { collapsed = false }: { collapsed?: boolean } = $props();
</script>

<nav class="flex flex-col gap-6" aria-label="Navigation par catégorie">
	<div>
		<h3 class="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			Chronologie
		</h3>
		<ul class="flex flex-col gap-0.5">
			{#each eras as era}
				<li>
					<a
						href="/chronologie/{era.slug}"
						class="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors {page.url.pathname.includes(era.slug) ? 'bg-surface-hover text-text' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
					>
						<span
							class="h-2 w-2 rounded-full"
							style="background-color: {era.color}"
						></span>
						{era.nameFr}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div>
		<h3 class="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			Catégories
		</h3>
		<ul class="flex flex-col gap-0.5">
			{#each categories as category}
				<li>
					<a
						href="/categories/{category.slug}"
						class="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors {page.url.pathname.includes(category.slug) ? 'bg-surface-hover text-text' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
					>
						<span class="text-base">{category.icon}</span>
						{category.name}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>
