<script lang="ts">
	let { src, alt, caption = '' }: { src: string; alt: string; caption?: string } = $props();
</script>

<figure class="my-6">
	<img
		{src}
		{alt}
		class="w-full rounded-lg border border-border"
		loading="lazy"
	/>
	{#if caption}
		<figcaption class="mt-2 text-center text-xs text-text-muted">
			{caption}
		</figcaption>
	{/if}
</figure>
