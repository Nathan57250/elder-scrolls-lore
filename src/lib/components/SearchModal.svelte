<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import { getAllEntries } from '$lib/utils/content-loader';
	import { getEra } from '$lib/data/eras';
	import { getCategory } from '$lib/data/categories';
	import type { LoreEntryFrontmatter } from '$lib/types/lore';

	let { locale }: { locale: Locale } = $props();

	let open = $state(false);
	let query = $state('');
	let selectedIndex = $state(0);
	let inputEl: HTMLInputElement | undefined = $state();

	const allEntries = $derived(getAllEntries(locale));

	function normalize(str: string): string {
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
	}

	const results: LoreEntryFrontmatter[] = $derived.by(() => {
		if (!query.trim()) return [];
		const normalizedQuery = normalize(query.trim());
		return allEntries
			.filter((entry) => normalize(entry.title).includes(normalizedQuery))
			.slice(0, 10);
	});

	function onInput() {
		selectedIndex = 0;
	}

	function openModal() {
		open = true;
		query = '';
		selectedIndex = 0;
		// Focus input after DOM updates
		setTimeout(() => inputEl?.focus(), 10);
	}

	function closeModal() {
		open = false;
		query = '';
	}

	function navigateToResult(entry: LoreEntryFrontmatter) {
		const url = localePath(locale, 'timeline', entry.era, entry.slug);
		closeModal();
		goto(url);
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			if (open) {
				closeModal();
			} else {
				openModal();
			}
			return;
		}

		if (!open) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			closeModal();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (results.length > 0) {
				selectedIndex = (selectedIndex + 1) % results.length;
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (results.length > 0) {
				selectedIndex = (selectedIndex - 1 + results.length) % results.length;
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (results.length > 0 && results[selectedIndex]) {
				navigateToResult(results[selectedIndex]);
			}
		}
	}

	function getEraBadge(entry: LoreEntryFrontmatter): { name: string; color: string } {
		const era = getEra(entry.era);
		if (!era) return { name: entry.era, color: '#666' };
		return { name: era.names[locale], color: era.color };
	}

	function getCategoryLabel(entry: LoreEntryFrontmatter): string {
		const cat = getCategory(entry.category);
		if (!cat) return entry.category;
		return cat.names[locale];
	}

	export function toggle() {
		if (open) closeModal();
		else openModal();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
		<button
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
			onclick={closeModal}
			aria-label="Close search"
		></button>

		<!-- Modal -->
		<div
			class="relative z-10 w-full max-w-lg rounded-xl border border-border bg-bg shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-label={t(locale, 'quicksearch.placeholder')}
		>
			<!-- Search input -->
			<div class="flex items-center gap-3 border-b border-border px-4 py-3">
				<svg class="h-5 w-5 shrink-0 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					bind:this={inputEl}
					bind:value={query}
					oninput={onInput}
					type="text"
					class="flex-1 bg-transparent text-base text-text placeholder-text-secondary outline-none"
					placeholder={t(locale, 'quicksearch.placeholder')}
				/>
				<kbd class="hidden rounded bg-surface px-1.5 py-0.5 text-xs text-text-secondary sm:inline-block">Esc</kbd>
			</div>

			<!-- Results -->
			<div class="max-h-[50vh] overflow-y-auto p-2">
				{#if query.trim() && results.length === 0}
					<div class="px-4 py-8 text-center text-sm text-text-secondary">
						{t(locale, 'quicksearch.noResults')}
					</div>
				{:else if results.length > 0}
					<ul role="listbox">
						{#each results as entry, i (entry.slug)}
							{@const eraBadge = getEraBadge(entry)}
							<li role="option" aria-selected={i === selectedIndex}>
								<button
									class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors {i === selectedIndex ? 'bg-surface-hover text-text' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}"
									onclick={() => navigateToResult(entry)}
									onmouseenter={() => (selectedIndex = i)}
								>
									<div class="flex-1 min-w-0">
										<p class="truncate text-sm font-medium text-text">{entry.title}</p>
										<p class="truncate text-xs text-text-secondary">{getCategoryLabel(entry)}</p>
									</div>
									<span
										class="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium"
										style="background-color: {eraBadge.color}20; color: {eraBadge.color}"
									>
										{eraBadge.name}
									</span>
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="px-4 py-8 text-center text-sm text-text-secondary">
						{t(locale, 'quicksearch.hint')}
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-text-secondary">
				<div class="flex items-center gap-2">
					<span class="flex items-center gap-1">
						<kbd class="rounded bg-surface px-1 py-0.5">↑</kbd>
						<kbd class="rounded bg-surface px-1 py-0.5">↓</kbd>
						naviguer
					</span>
					<span class="flex items-center gap-1">
						<kbd class="rounded bg-surface px-1 py-0.5">↵</kbd>
						ouvrir
					</span>
				</div>
				<span class="flex items-center gap-1">
					<kbd class="rounded bg-surface px-1 py-0.5">Esc</kbd>
					fermer
				</span>
			</div>
		</div>
	</div>
{/if}
