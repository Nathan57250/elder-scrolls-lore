<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import CompareView from '$lib/components/CompareView.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'compare.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'compare.title')} />
</svelte:head>

<CompareView {locale} />
