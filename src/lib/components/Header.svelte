<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getSidebarState, getBookModeState, getThemeState } from '$lib/stores/app-state.svelte';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { getAllEntries } from '$lib/utils/content-loader';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';

	let { locale }: { locale: Locale } = $props();

	const sidebar = getSidebarState();
	const bookModeState = getBookModeState();
	const themeState = getThemeState();

	let isMac = $state(false);

	onMount(() => {
		isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	});

	function goToRandomArticle() {
		const entries = getAllEntries(locale);
		if (entries.length === 0) return;
		const entry = entries[Math.floor(Math.random() * entries.length)];
		goto(localePath(locale, 'timeline', entry.era, entry.slug));
	}

	function openSearch() {
		// Dispatch Cmd+K programmatically to open the search modal
		const event = new KeyboardEvent('keydown', {
			key: 'k',
			metaKey: true,
			ctrlKey: true,
			bubbles: true
		});
		window.dispatchEvent(event);
	}
</script>

<header class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<div class="flex items-center gap-3">
			<button
				onclick={() => sidebar.toggle()}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text lg:hidden"
				class:hidden={bookModeState.active}
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

		<nav class="hidden items-center gap-1 md:flex" class:!hidden={bookModeState.active}>
			<a href={localePath(locale, 'timeline', 'dawn-era')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.timeline')}
			</a>
			<a href={localePath(locale, 'categories', 'cosmologie')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.categories')}
			</a>
			<a href={localePath(locale, 'tags')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.tags')}
			</a>
			<a href={localePath(locale, 'graph')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.graph')}
			</a>
			<a href={localePath(locale, 'map')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.map')}
			</a>
			<a href={localePath(locale, 'timeline-view')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.timelineView')}
			</a>
			<a href={localePath(locale, 'quiz')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.quiz')}
			</a>
			<a href={localePath(locale, 'lineages')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.lineages')}
			</a>
			<a href={localePath(locale, 'paths')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.paths')}
			</a>
			<a href={localePath(locale, 'stats')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.stats')}
			</a>
			<a href={localePath(locale, 'search')} class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				{t(locale, 'nav.search')}
			</a>
		</nav>

		<div class="flex items-center gap-1">
			<LocaleSwitcher {locale} />
			<a
				href="https://github.com/Nathan57250/elder-scrolls-lore"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label="GitHub"
				title="GitHub"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
				</svg>
			</a>
			<button
				onclick={() => bookModeState.toggle()}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text {bookModeState.active ? 'bg-surface-hover text-accent' : ''}"
				aria-label={t(locale, 'nav.readingMode')}
				title={t(locale, 'nav.readingMode')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
			</button>
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
			<button
				onclick={openSearch}
				class="flex items-center gap-1.5 rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'nav.search')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<kbd class="hidden rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-secondary sm:inline-block">{isMac ? '⌘' : 'Ctrl+'}K</kbd>
			</button>
			<button
				onclick={goToRandomArticle}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'nav.random')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
				</svg>
			</button>
		</div>
	</div>
</header>
