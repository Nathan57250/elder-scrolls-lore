<script lang="ts">
	import { onMount } from 'svelte';
	import { getMapState } from '$lib/stores/app-state.svelte';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { page } from '$app/state';
	import { defaultLocale } from '$lib/i18n';

	const mapState = getMapState();
	const locale = $derived((page.data?.locale as Locale) ?? defaultLocale);

	let mapContainer: HTMLDivElement;
	let map: any;
	let marker: any;

	onMount(async () => {
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		const bounds: [[number, number], [number, number]] = [[0, 0], [800, 1024]];

		map = L.map(mapContainer, {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 3,
			maxBounds: bounds,
			maxBoundsViscosity: 1.0
		});

		L.imageOverlay('/map/tamriel.jpg', bounds).addTo(map);
		map.fitBounds(bounds);

		return () => {
			map?.remove();
		};
	});

	$effect(() => {
		if (map && mapState.location) {
			const loc = mapState.location;
			const latLng: [number, number] = [800 - loc.coords.y, loc.coords.x];

			if (marker) {
				marker.setLatLng(latLng);
			} else {
				const L = (window as any).L;
				if (L) {
					marker = L.marker(latLng).addTo(map);
				}
			}
			map.flyTo(latLng, 2, { duration: 0.5 });
			if (marker) {
				marker.bindPopup(`<strong>${loc.names[locale]}</strong><br>${loc.province}`).openPopup();
			}
		}
	});
</script>

{#if mapState.open}
	<div class="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-bg shadow-2xl sm:w-[40%] sm:min-w-[380px]">
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-border p-4">
			<div>
				{#if mapState.location}
					<h3 class="text-base font-semibold text-text">
						{mapState.location.names[locale]}
					</h3>
					<p class="text-sm text-text-muted">
						{mapState.location.province}
					</p>
				{:else}
					<h3 class="text-base font-semibold text-text">{t(locale, 'map.title')}</h3>
				{/if}
			</div>
			<button
				onclick={() => mapState.close()}
				class="rounded-md p-2 text-text-secondary hover:bg-surface-hover hover:text-text"
				aria-label={t(locale, 'map.close')}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Map -->
		<div class="flex-1" bind:this={mapContainer}></div>

		<!-- Footer -->
		{#if mapState.location}
			<div class="border-t border-border p-4">
				<p class="mb-3 text-sm text-text-secondary">
					{mapState.location.summary}
				</p>
				{#if mapState.location.articleSlug}
					<a
						href={localePath(locale, 'timeline', mapState.location.articleSlug)}
						class="inline-flex items-center gap-1.5 rounded-md bg-accent-muted px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-muted/80"
					>
						{t(locale, 'map.read')}
					</a>
				{/if}
			</div>
		{/if}
	</div>
{/if}
