<script lang="ts">
	import { getMapState } from '$lib/stores/app-state.svelte';
	import { getLocation } from '$lib/data/locations';

	let { slug, name }: { slug: string; name: string } = $props();

	const mapState = getMapState();
	const location = $derived(getLocation(slug));

	function handleClick() {
		if (location) {
			mapState.showLocation(location);
		}
	}
</script>

<button
	onclick={handleClick}
	class="inline cursor-pointer border-b border-dotted border-accent-muted bg-transparent p-0 text-inherit hover:border-accent hover:text-accent"
	aria-label="Voir {name} sur la carte"
	disabled={!location}
>
	<span class="mr-0.5 text-xs opacity-70">📍</span>{name}
</button>
