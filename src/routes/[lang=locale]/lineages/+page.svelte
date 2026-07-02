<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import LineageTree from '$lib/components/LineageTree.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'lineages.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'lineages.title')} />
</svelte:head>

<div class="flex h-[calc(100vh-4rem)] flex-col px-4 py-4">
	<header class="mb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text">
			{t(locale, 'lineages.title')}
		</h1>
	</header>

	<div class="min-h-0 flex-1">
		<LineageTree {locale} />
	</div>
</div>
