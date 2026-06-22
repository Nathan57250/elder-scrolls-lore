<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import CategoryNav from '$lib/components/CategoryNav.svelte';
	import MapPanel from '$lib/components/MapPanel.svelte';
	import LorePreviewPanel from '$lib/components/LorePreviewPanel.svelte';
	import { getSidebarState, getThemeState } from '$lib/stores/app-state.svelte';

	let { children } = $props();
	const sidebar = getSidebarState();
	const themeState = getThemeState();

	onMount(() => {
		themeState.init();
	});
</script>

<svelte:head>
	<title>Grand Livre du Lore — Elder Scrolls</title>
	<meta name="description" content="Encyclopédie complète et interactive du lore de l'univers The Elder Scrolls." />
</svelte:head>

<div class="flex min-h-screen flex-col bg-bg text-text">
	<Header />

	<div class="flex flex-1">
		<!-- Sidebar desktop -->
		<aside class="hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-bg p-4 lg:block">
			<CategoryNav />
		</aside>

		<!-- Sidebar mobile (overlay) -->
		{#if sidebar.open}
			<div class="fixed inset-0 z-40 lg:hidden">
				<button
					class="absolute inset-0 bg-black/60 backdrop-blur-sm"
					onclick={() => sidebar.close()}
					aria-label="Fermer le menu"
				></button>
				<aside class="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-bg p-4 shadow-2xl">
					<CategoryNav />
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
