<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import CategoryNav from '$lib/components/CategoryNav.svelte';
	import MapPanel from '$lib/components/MapPanel.svelte';
	import LorePreviewPanel from '$lib/components/LorePreviewPanel.svelte';
	import { getSidebarState, getThemeState } from '$lib/stores/app-state.svelte';
	import { page } from '$app/state';
	import { defaultLocale, t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';

	let { children } = $props();
	const sidebar = getSidebarState();
	const themeState = getThemeState();

	const locale = $derived((page.data?.locale as Locale) ?? defaultLocale);

	const SITE_URL = 'https://elder-scrolls-lore.vercel.app';

	const localeMap: Record<Locale, string> = {
		fr: 'fr_FR',
		en: 'en_US',
		es: 'es_ES'
	};

	onMount(() => {
		themeState.init();
	});
</script>

<svelte:head>
	<title>{t(locale, 'site.title')} — Elder Scrolls</title>
	<meta name="description" content={t(locale, 'site.description')} />
	<meta property="og:title" content="{t(locale, 'site.title')} — Elder Scrolls" />
	<meta property="og:description" content={t(locale, 'site.description')} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={localeMap[locale]} />
	<meta property="og:image" content="{SITE_URL}/images/common/tamriel-map.jpg" />
	<meta property="og:site_name" content="Elder Scrolls Lore" />
	<meta property="og:url" content="{SITE_URL}{page.url.pathname}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{t(locale, 'site.title')} — Elder Scrolls" />
	<meta name="twitter:description" content={t(locale, 'site.description')} />
	<meta name="twitter:image" content="{SITE_URL}/images/common/tamriel-map.jpg" />
	<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/{locale}/rss.xml" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-bg text-text">
	<Header {locale} />

	<div class="flex flex-1">
		<!-- Sidebar desktop -->
		<aside class="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-bg p-4 lg:block">
			<CategoryNav {locale} />
		</aside>

		<!-- Sidebar mobile (overlay) -->
		{#if sidebar.open}
			<div class="fixed inset-0 z-40 lg:hidden">
				<button
					class="absolute inset-0 bg-black/60 backdrop-blur-sm"
					onclick={() => sidebar.close()}
					aria-label="Close menu"
				></button>
				<aside class="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-bg p-4 shadow-2xl">
					<CategoryNav {locale} />
				</aside>
			</div>
		{/if}

		<!-- Main content -->
		<main class="flex-1 overflow-x-hidden">
			{@render children()}
		</main>
	</div>

	<MapPanel />
	<LorePreviewPanel />
</div>
