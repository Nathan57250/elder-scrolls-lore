<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import TimelineView from '$lib/components/TimelineView.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'timeline.visual.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'timeline.visual.title')} />
</svelte:head>

<TimelineView {locale} />
