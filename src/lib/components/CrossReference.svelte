<script lang="ts">
	let { slug, name }: { slug: string; name: string } = $props();
</script>

<a
	href="/chronologie/{slug}"
	class="inline text-accent underline decoration-accent-muted decoration-1 underline-offset-2 transition-colors hover:text-accent-hover hover:decoration-accent"
>
	{name}
</a>
