<script lang="ts">
	import { onMount } from 'svelte';
	import { getReadingProgressState } from '$lib/stores/reading-progress.svelte';
	import { t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';

	let { slug, locale }: { slug: string; locale: Locale } = $props();

	const readingProgress = getReadingProgressState();
	let progress = $state(0);

	onMount(() => {
		readingProgress.init();
		progress = readingProgress.getProgress(slug);
	});

	const isComplete = $derived(progress >= 100);
	const hasProgress = $derived(progress > 0);
</script>

{#if hasProgress}
	<span
		class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {isComplete ? 'bg-green-500/15 text-green-400' : 'bg-accent/10 text-accent'}"
		title={t(locale, 'progress.read', { percent: progress })}
	>
		{#if isComplete}
			<svg class="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
				<path fill-rule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06L7 8.94 5.28 7.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" clip-rule="evenodd"/>
			</svg>
			<span>100%</span>
		{:else}
			<svg class="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="8" cy="8" r="6" opacity="0.3" />
				<path
					d="M8 2 a6 6 0 0 1 0 0"
					stroke-linecap="round"
					style="stroke-dasharray: {(progress / 100) * 37.7} 37.7; transform-origin: center; transform: rotate(-90deg);"
				/>
			</svg>
			<span>{progress}%</span>
		{/if}
	</span>
{/if}
