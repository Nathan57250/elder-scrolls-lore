<script lang="ts">
	import type { Locale } from '$lib/i18n';

	interface Props {
		title: string;
		description: string;
		locale: Locale;
		url?: string;
		image?: string;
		type?: string;
	}

	let { title, description, locale, url, image, type = 'article' }: Props = $props();

	const SITE_URL = 'https://elder-scrolls-lore.vercel.app';

	const localeMap: Record<Locale, string> = {
		fr: 'fr_FR',
		en: 'en_US',
		es: 'es_ES'
	};

	const ogLocale = $derived(localeMap[locale]);
	const ogImage = $derived(image ? `${SITE_URL}${image}` : `${SITE_URL}/images/common/tamriel-map.jpg`);
	const ogUrl = $derived(url ? `${SITE_URL}${url}` : undefined);
</script>

<svelte:head>
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content="Elder Scrolls Lore" />
	{#if ogUrl}
		<meta property="og:url" content={ogUrl} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
