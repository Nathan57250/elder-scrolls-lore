<script lang="ts">
	import type { LoreEntryFrontmatter } from '$lib/types/lore';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { page } from '$app/state';
	import { defaultLocale } from '$lib/i18n';

	let { articles = [] }: { articles?: LoreEntryFrontmatter[] } = $props();
	const locale = $derived((page.data?.locale as Locale) ?? defaultLocale);
</script>

{#if articles.length > 0}
	<aside class="mt-8 rounded-lg border border-border bg-surface p-4">
		<h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			{t(locale, 'article.related')}
		</h3>
		<ul class="flex flex-col gap-2">
			{#each articles as article}
				<li>
					<a
						href={localePath(locale, 'timeline', article.era, article.slug)}
						class="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
					>
						<span class="h-1 w-1 rounded-full bg-accent"></span>
						{article.title}
					</a>
				</li>
			{/each}
		</ul>
	</aside>
{/if}
