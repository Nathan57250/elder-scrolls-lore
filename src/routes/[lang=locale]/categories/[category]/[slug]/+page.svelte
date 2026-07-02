<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import SeoMeta from '$lib/components/SeoMeta.svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	let Component = $derived(data.component);
	const locale = $derived(data.locale);
	const description = $derived(data.metadata.summary ?? data.metadata.description ?? '');
</script>

<svelte:head>
	<title>{data.metadata.title} — {t(locale, 'site.title')}</title>
	<meta name="description" content={description} />
</svelte:head>

<SeoMeta
	title="{data.metadata.title} — {t(locale, 'site.title')}"
	{description}
	{locale}
	url={page.url.pathname}
/>

<Component />
