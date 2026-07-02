<script lang="ts">
	import { t } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import { narrativePaths } from '$lib/data/narrative-paths';
	import { getAllEntries } from '$lib/utils/content-loader';
	import { getReadingProgressState } from '$lib/stores/reading-progress.svelte';
	import type { LoreEntryFrontmatter } from '$lib/types/lore';

	let { locale }: { locale: Locale } = $props();

	const progressState = getReadingProgressState();
	const allEntries = $derived(getAllEntries(locale));

	let expandedPath = $state<string | null>(null);

	function togglePath(id: string) {
		expandedPath = expandedPath === id ? null : id;
	}

	function getArticleEntry(slug: string): LoreEntryFrontmatter | undefined {
		return allEntries.find((e) => e.slug === slug);
	}

	function getPathProgress(articleSlugs: string[]): { read: number; total: number; percent: number } {
		const total = articleSlugs.length;
		let read = 0;
		for (const slug of articleSlugs) {
			if (progressState.getProgress(slug) >= 100) {
				read++;
			}
		}
		const percent = total > 0 ? Math.round((read / total) * 100) : 0;
		return { read, total, percent };
	}

	function getNextUnread(articleSlugs: string[]): string | null {
		for (const slug of articleSlugs) {
			if (progressState.getProgress(slug) < 100) {
				return slug;
			}
		}
		return null;
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-2 text-2xl font-bold tracking-tight text-text">
		{t(locale, 'paths.title')}
	</h1>
	<p class="mb-8 text-text-secondary">
		{t(locale, 'paths.subtitle')}
	</p>

	<div class="flex flex-col gap-4">
		{#each narrativePaths as path}
			{@const progress = getPathProgress(path.articles)}
			{@const nextUnread = getNextUnread(path.articles)}
			{@const isExpanded = expandedPath === path.id}

			<div class="overflow-hidden rounded-xl border border-border bg-surface transition-all">
				<button
					onclick={() => togglePath(path.id)}
					class="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-surface-hover"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl" style="background-color: {path.color}20;">
						{path.icon}
					</span>

					<div class="min-w-0 flex-1">
						<h2 class="text-base font-semibold text-text">
							{path.names[locale]}
						</h2>
						<p class="mt-0.5 truncate text-sm text-text-secondary">
							{path.descriptions[locale]}
						</p>
						<div class="mt-2 flex items-center gap-3 text-xs text-text-muted">
							<span>{t(locale, 'paths.articles', { count: path.articles.length })}</span>
							<span>{t(locale, 'paths.progress', { percent: progress.percent })}</span>
						</div>
					</div>

					<div class="flex shrink-0 flex-col items-end gap-2">
						{#if progress.percent === 100}
							<span class="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
								{t(locale, 'paths.completed')}
							</span>
						{:else}
							<span class="text-sm font-medium" style="color: {path.color};">{progress.percent}%</span>
						{/if}
						<svg
							class="h-4 w-4 text-text-muted transition-transform {isExpanded ? 'rotate-180' : ''}"
							fill="none" stroke="currentColor" viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</button>

				<!-- Progress bar -->
				<div class="mx-4 mb-3 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
					<div
						class="h-full rounded-full transition-all duration-500"
						style="width: {progress.percent}%; background-color: {path.color};"
					></div>
				</div>

				<!-- Expanded article list -->
				{#if isExpanded}
					<div class="border-t border-border px-4 py-3">
						<ul class="flex flex-col gap-2">
							{#each path.articles as slug, i}
								{@const entry = getArticleEntry(slug)}
								{@const articleProgress = progressState.getProgress(slug)}
								{@const isNext = slug === nextUnread}
								{@const isCompleted = articleProgress >= 100}

								<li class="flex items-center gap-3 rounded-lg p-2 transition-colors {isNext ? 'bg-bg-elevated' : ''}">
									<!-- Step number / checkmark -->
									<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium {isCompleted ? 'bg-green-500/10 text-green-600' : 'bg-bg-elevated text-text-muted'}">
										{#if isCompleted}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
										{:else}
											{i + 1}
										{/if}
									</span>

									<!-- Article info -->
									<div class="min-w-0 flex-1">
										<div class="flex items-center gap-2">
											<span class="truncate text-sm font-medium text-text">
												{entry?.title ?? slug}
											</span>
											{#if isNext}
												<span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style="background-color: {path.color}20; color: {path.color};">
													{t(locale, 'paths.next')}
												</span>
											{/if}
										</div>
										{#if articleProgress > 0 && articleProgress < 100}
											<div class="mt-1 flex items-center gap-2">
												<div class="h-1 flex-1 overflow-hidden rounded-full bg-bg-elevated">
													<div class="h-full rounded-full bg-text-muted/40" style="width: {articleProgress}%;"></div>
												</div>
												<span class="text-[10px] text-text-muted">{articleProgress}%</span>
											</div>
										{/if}
									</div>

									<!-- Action button -->
									{#if entry}
										<a
											href={localePath(locale, 'timeline', entry.era, entry.slug)}
											class="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors {isNext ? 'text-white' : 'bg-bg-elevated text-text-secondary hover:bg-surface-hover hover:text-text'}"
											style={isNext ? `background-color: ${path.color};` : ''}
										>
											{#if isCompleted}
												{t(locale, 'paths.continue')}
											{:else if articleProgress > 0}
												{t(locale, 'paths.continue')}
											{:else}
												{t(locale, 'paths.start')}
											{/if}
										</a>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
