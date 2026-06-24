<script lang="ts">
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { page } from '$app/state';
	import { defaultLocale } from '$lib/i18n';

	let { slug, name }: { slug: string; name: string } = $props();
	const locale = $derived((page.data?.locale as Locale) ?? defaultLocale);
</script>

<a
	href={localePath(locale, 'timeline', slug)}
	class="inline text-accent underline decoration-accent-muted decoration-1 underline-offset-2 transition-colors hover:text-accent-hover hover:decoration-accent"
>
	{name}
</a>
