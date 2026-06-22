<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let Component = $derived(data.component);
</script>

<svelte:head>
	<title>{data.metadata.title} — Grand Livre du Lore</title>
	<meta name="description" content={data.metadata.summary ?? data.metadata.description ?? ''} />
</svelte:head>

<Component />
