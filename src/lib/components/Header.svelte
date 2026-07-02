<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSidebarState, getThemeState } from '$lib/stores/app-state.svelte';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { getAllEntries } from '$lib/utils/content-loader';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';

	let { locale }: { locale: Locale } = $props();

	const sidebar = getSidebarState();
	const themeState = getThemeState();

	function goToRandomArticle() {
		const entries = getAllEntries(locale);
		if (entries.length === 0) return;
		const entry = entries[Math.floor(Math.random() * entries.length)];
		goto(localePath(locale, 'timeline', entry.era, entry.slug));
	}
</script>

<header class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<div class="flex items-center gap-3">
			<button
				onclick={() => sidebar.toggle()}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text lg:hidden"
				aria-label={t(locale, 'nav.menu')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<a href="/{locale}" class="text-lg font-semibold tracking-tight text-text">
				{t(locale, 'site.title')}
			</a>
		</div>

		<nav class="hidden items-center gap-1 md:flex">
			<a href={localePath(locale, 'timeline', 'dawn-era')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.timeline')}
			</a>
			<a href={localePath(locale, 'categories', 'cosmologie')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.categories')}
			</a>
			<a href={localePath(locale, 'tags')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.tags')}
			</a>
			<a href={localePath(locale, 'search')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.search')}
			</a>
		</nav>

		<div class="flex items-center gap-1">
			<LocaleSwitcher {locale} />
			<button
				onclick={() => themeState.toggle()}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'nav.theme')}
			>
				{#if themeState.isDark}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
					</svg>
				{/if}
			</button>
			<a
				href={localePath(locale, 'search')}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'nav.search')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</a>
			<button
				onclick={goToRandomArticle}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'nav.random')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
				</svg>
			</button>
			<a
				href="/{locale}/rss.xml"
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label="RSS"
				target="_blank"
				rel="noopener"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.503 20.752A2.25 2.25 0 014.252 18.5a2.25 2.25 0 012.251-2.252 2.25 2.25 0 012.252 2.252 2.25 2.25 0 01-2.252 2.252zM4.252 12.5A8.25 8.25 0 0112.5 20.748M4.252 4.5A16.25 16.25 0 0120.5 20.748" />
				</svg>
			</a>
		</div>
	</div>
</header>
