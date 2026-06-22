<script lang="ts">
	import { getSidebarState, getThemeState } from '$lib/stores/app-state.svelte';

	const sidebar = getSidebarState();
	const themeState = getThemeState();
</script>

<header class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<div class="flex items-center gap-3">
			<button
				onclick={() => sidebar.toggle()}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text lg:hidden"
				aria-label="Menu"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<a href="/" class="text-lg font-semibold tracking-tight text-text">
				Grand Livre du Lore
			</a>
		</div>

		<nav class="hidden items-center gap-1 md:flex">
			<a href="/chronologie/dawn-era" class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				Chronologie
			</a>
			<a href="/categories/cosmologie" class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				Catégories
			</a>
			<a href="/recherche" class="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text">
				Recherche
			</a>
		</nav>

		<div class="flex items-center gap-1">
			<button
				onclick={() => themeState.toggle()}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label="Changer le thème"
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
				href="/recherche"
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label="Rechercher"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</a>
		</div>
	</div>
</header>
