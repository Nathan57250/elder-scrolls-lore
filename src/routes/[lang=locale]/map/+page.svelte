<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import MapView from '$lib/components/MapView.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'map.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'map.title')} />
</svelte:head>

<MapView {locale} />
