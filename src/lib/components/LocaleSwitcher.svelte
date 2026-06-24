<script lang="ts">
	import { locales } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';
	import { page } from '$app/state';

	let { locale }: { locale: Locale } = $props();

	const labels: Record<Locale, string> = { fr: 'FR', en: 'EN', es: 'ES' };

	function switchUrl(target: Locale): string {
		const path = page.url.pathname;
		const segments = path.split('/').filter(Boolean);
		if (segments[0] === locale) {
			segments[0] = target;
		}
		return '/' + segments.join('/');
	}
</script>

<div class="flex items-center gap-0.5">
	{#each locales as l}
		<a
			href={switchUrl(l)}
			class="rounded px-1.5 py-0.5 text-xs font-medium transition-colors {l === locale ? 'bg-accent-muted text-accent' : 'text-text-muted hover:text-text'}"
			aria-label="Switch to {labels[l]}"
		>
			{labels[l]}
		</a>
	{/each}
</div>
