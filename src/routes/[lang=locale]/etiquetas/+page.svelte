<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'tags.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'tags.description')} />
</svelte:head>

<div class="px-4 py-8">
	<header class="mx-auto mb-8 max-w-3xl">
		<h1 class="text-2xl font-bold tracking-tight text-text">
			{t(locale, 'tags.title')}
		</h1>
		<p class="mt-3 text-text-secondary">
			{t(locale, 'tags.description')}
		</p>
	</header>

	<div class="mx-auto max-w-3xl">
		{#if data.tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each data.tags as { tag, count }}
					<a
						href={localePath(locale, 'tags', encodeURIComponent(tag))}
						class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm transition-all hover:border-border-subtle hover:bg-surface-hover"
					>
						<span class="font-medium text-text">{tag}</span>
						<span class="rounded bg-bg-elevated px-1.5 py-0.5 text-xs text-text-muted">
							{count}
						</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
