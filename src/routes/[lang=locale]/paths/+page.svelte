<script lang="ts">
	import NarrativePaths from '$lib/components/NarrativePaths.svelte';
	import { t } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'paths.title')} — {t(locale, 'site.title')}</title>
</svelte:head>

<NarrativePaths {locale} />
