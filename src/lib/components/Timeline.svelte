<script lang="ts">
	import type { TimelineEvent, EraSlug } from '$lib/types/lore';
	import { eras } from '$lib/data/eras';
	import { getTimelineEntries } from '$lib/utils/content-loader';

	const entries = getTimelineEntries();

	let selectedEra = $state<EraSlug | null>(null);

	const filteredEntries = $derived(
		selectedEra ? entries.filter((e) => e.era === selectedEra) : entries
	);

	const groupedByEra = $derived(() => {
		const groups: Record<EraSlug, typeof entries> = {
			'dawn-era': [],
			'merethic-era': [],
			'first-era': [],
			'second-era': [],
			'third-era': [],
			'fourth-era': []
		};
		for (const entry of filteredEntries) {
			groups[entry.era].push(entry);
		}
		return groups;
	});
</script>

<div class="timeline-container py-8">
	<!-- Era filter buttons -->
	<div class="mb-8 flex flex-wrap justify-center gap-2 px-4">
		<button
			onclick={() => (selectedEra = null)}
			class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {!selectedEra ? 'bg-accent-muted text-accent' : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text'}"
		>
			Toutes
		</button>
		{#each eras as era}
			<button
				onclick={() => (selectedEra = era.slug)}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {selectedEra === era.slug ? 'text-text' : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text'}"
				style={selectedEra === era.slug ? `background-color: ${era.color}20; color: ${era.color}` : ''}
			>
				{era.nameFr}
			</button>
		{/each}
	</div>

	<!-- Timeline vertical -->
	<div class="relative mx-auto max-w-3xl px-4">
		<!-- Vertical line -->
		<div class="absolute left-8 top-0 h-full w-px bg-border md:left-1/2"></div>

		{#each eras as era}
			{@const eraEntries = filteredEntries.filter((e) => e.era === era.slug)}
			{#if eraEntries.length > 0}
				<!-- Era header -->
				<div class="relative mb-6 pl-16 md:pl-0 md:text-center">
					<div
						class="inline-block rounded-full px-3 py-1 text-xs font-medium"
						style="background-color: {era.color}15; color: {era.color}"
					>
						{era.nameFr}
					</div>
				</div>

				<!-- Events -->
				{#each eraEntries as entry, i}
					<div class="relative mb-4 flex items-start gap-4 pl-16 md:pl-0 {i % 2 === 1 ? 'md:flex-row-reverse' : ''}">
						<!-- Dot -->
						<div
							class="absolute left-[29px] top-3 h-2.5 w-2.5 rounded-full border-2 border-bg md:left-1/2 md:-translate-x-1/2"
							style="background-color: {era.color}"
						></div>

						<!-- Card -->
						<a
							href="/chronologie/{entry.era}/{entry.slug}"
							class="block w-full rounded-lg border border-border bg-surface p-4 transition-all hover:border-border-subtle hover:bg-surface-hover md:w-[calc(50%-2rem)] {i % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}"
						>
							{#if entry.date}
								<span class="text-xs text-text-muted">
									{entry.date}
								</span>
							{/if}
							<h3 class="text-sm font-semibold text-text">
								{entry.title}
							</h3>
							<p class="mt-1 text-xs text-text-secondary">
								{entry.summary ?? entry.description ?? ''}
							</p>
						</a>
					</div>
				{/each}
			{/if}
		{/each}

		{#if filteredEntries.length === 0}
			<div class="py-16 text-center text-text-muted">
				<p class="text-lg font-medium">Aucun événement trouvé</p>
				<p class="mt-2 text-sm">Sélectionnez une autre ère ou consultez toutes les ères.</p>
			</div>
		{/if}
	</div>
</div>
