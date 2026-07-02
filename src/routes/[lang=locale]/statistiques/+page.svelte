<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import StatsView from '$lib/components/StatsView.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'stats.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'stats.title')} />
</svelte:head>

<StatsView {locale} />
