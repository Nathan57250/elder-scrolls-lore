<script lang="ts">
	import Timeline from '$lib/components/Timeline.svelte';
	import { eras, getEraName, getEraDescription } from '$lib/data/eras';
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import { page } from '$app/state';
	import type { Locale } from '$lib/i18n';

	let { data } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'site.title')}</title>
</svelte:head>

<div class="px-4 py-12">
	<!-- Hero -->
	<section class="mx-auto mb-16 max-w-3xl text-center">
		<h1 class="text-4xl font-bold tracking-tight text-text md:text-5xl">
			{t(locale, 'site.title')}
		</h1>
		<p class="mt-4 text-lg text-text-secondary">
			{t(locale, 'site.description')}
		</p>
	</section>

	<!-- Era overview cards -->
	<section class="mx-auto mb-16 max-w-5xl">
		<h2 class="mb-6 text-center text-xl font-semibold text-text">
			{t(locale, 'home.eras')}
		</h2>
		<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each eras as era}
				<a
					href={localePath(locale, 'timeline', era.slug)}
					class="group rounded-lg border border-border bg-surface p-5 transition-all hover:border-border-subtle hover:bg-surface-hover"
				>
					<div class="mb-2 flex items-center gap-2">
						<span
							class="h-2.5 w-2.5 rounded-full"
							style="background-color: {era.color}"
						></span>
						<h3 class="text-sm font-semibold text-text group-hover:text-accent">
							{getEraName(era, locale)}
						</h3>
					</div>
					<p class="text-sm text-text-secondary">
						{getEraDescription(era, locale)}
					</p>
				</a>
			{/each}
		</div>
	</section>

	<!-- Timeline -->
	<section>
		<h2 class="mb-6 text-center text-xl font-semibold text-text">
			{t(locale, 'nav.timeline')}
		</h2>
		<Timeline {locale} />
	</section>
</div>
