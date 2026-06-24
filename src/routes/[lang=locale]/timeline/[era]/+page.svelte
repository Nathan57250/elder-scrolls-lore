<script lang="ts">
	import type { PageData } from './$types';
	import { getEraName, getEraDescription } from '$lib/data/eras';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{getEraName(data.era, locale)} — {t(locale, 'site.title')}</title>
	<meta name="description" content={getEraDescription(data.era, locale)} />
</svelte:head>

<div class="px-4 py-8">
	<header class="mx-auto mb-8 max-w-3xl">
		<div class="flex items-center gap-3">
			<span
				class="h-3 w-3 rounded-full"
				style="background-color: {data.era.color}"
			></span>
			<h1 class="text-2xl font-bold tracking-tight text-text">
				{getEraName(data.era, locale)}
			</h1>
		</div>
		<p class="mt-3 text-text-secondary">
			{getEraDescription(data.era, locale)}
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
				<p class="text-lg font-medium">{t(locale, 'era.empty')}</p>
				<p class="mt-2 text-sm">{t(locale, 'era.empty.hint')}</p>
			</div>
		{/if}
	</div>
</div>
