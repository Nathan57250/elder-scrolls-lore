<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';

	let { data }: { data: PageData } = $props();
	let Component = $derived(data.component);
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{data.metadata.title} — {t(locale, 'site.title')}</title>
	<meta name="description" content={data.metadata.summary ?? data.metadata.description ?? ''} />
</svelte:head>

<Component />
