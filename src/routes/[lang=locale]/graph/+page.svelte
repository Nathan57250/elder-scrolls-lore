<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import { page } from '$app/state';
	import RelationsGraph from '$lib/components/RelationsGraph.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const focus = $derived(page.url.searchParams.get('focus') ?? undefined);
</script>

<svelte:head>
	<title>{t(locale, 'graph.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'graph.title')} />
</svelte:head>

<div class="flex h-[calc(100vh-4rem)] flex-col px-4 py-4">
	<header class="mb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text">
			{t(locale, 'graph.title')}
		</h1>
		{#if focus}
			<p class="mt-1 text-sm text-text-secondary">
				{t(locale, 'graph.focus', { name: focus })}
			</p>
		{/if}
	</header>

	<div class="min-h-0 flex-1">
		<RelationsGraph {locale} centerSlug={focus} />
	</div>
</div>
