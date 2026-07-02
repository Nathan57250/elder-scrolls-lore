<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{data.tag} — {t(locale, 'tags.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content="{t(locale, 'tags.count', { count: data.entries.length })} — {data.tag}" />
</svelte:head>

<div class="px-4 py-8">
	<header class="mx-auto mb-8 max-w-3xl">
		<a
			href={localePath(locale, 'tags')}
			class="mb-4 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			{t(locale, 'tags.back')}
		</a>
		<h1 class="text-2xl font-bold tracking-tight text-text">
			{data.tag}
		</h1>
		<p class="mt-2 text-text-secondary">
			{t(locale, 'tags.count', { count: data.entries.length })}
		</p>
	</header>

	<div class="mx-auto max-w-3xl">
		{#if data.entries.length > 0}
			<ul class="flex flex-col gap-2">
				{#each data.entries as entry}
					<li>
						<a
							href={localePath(locale, 'timeline', entry.era, entry.slug)}
							class="block rounded-lg border border-border bg-surface p-4 transition-all hover:border-border-subtle hover:bg-surface-hover"
						>
							{#if entry.date}
								<span class="text-xs text-text-muted">
									{entry.date}
								</span>
							{/if}
							<h3 class="text-sm font-semibold text-text">
								{entry.title}
							</h3>
							<p class="mt-1 text-sm text-text-secondary">
								{entry.summary ?? entry.description ?? ''}
							</p>
							{#if entry.tags?.length}
								<div class="mt-2 flex flex-wrap gap-1">
									{#each entry.tags.slice(0, 4) as tag}
										<span class="rounded bg-bg-elevated px-1.5 py-0.5 text-xs text-text-muted">
											{tag}
										</span>
									{/each}
								</div>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="py-12 text-center text-text-muted">
				<p class="text-lg font-medium">{t(locale, 'tags.empty')}</p>
				<p class="mt-2 text-sm">{t(locale, 'tags.empty.hint')}</p>
			</div>
		{/if}
	</div>
</div>
