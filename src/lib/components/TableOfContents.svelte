<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';

	let { locale, collapsible = false }: { locale: Locale; collapsible?: boolean } = $props();

	interface TocItem {
		id: string;
		text: string;
		level: number;
	}

	let items = $state<TocItem[]>([]);
	let activeId = $state<string>('');
	let open = $state(false);

	function generateId(text: string): string {
		return text
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	onMount(() => {
		const headings = document.querySelectorAll('.lore-content h2, .lore-content h3');

		items = Array.from(headings).map((h) => {
			const id = h.id || generateId(h.textContent || '');
			if (!h.id) h.id = id;
			return {
				id,
				text: h.textContent || '',
				level: parseInt(h.tagName[1])
			};
		});

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				}
			},
			{ rootMargin: '-80px 0px -60% 0px' }
		);

		headings.forEach((h) => observer.observe(h));

		return () => observer.disconnect();
	});

	function scrollTo(e: MouseEvent, id: string) {
		e.preventDefault();
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			history.replaceState(null, '', `#${id}`);
		}
	}
</script>

{#if items.length > 0}
	<nav aria-label={t(locale, 'article.toc')} class={collapsible ? 'rounded-lg border border-border bg-bg-elevated p-4' : ''}>
		{#if collapsible}
			<button
				onclick={() => (open = !open)}
				class="flex w-full items-center justify-between text-xs font-medium uppercase tracking-wider text-text-muted"
			>
				{t(locale, 'article.toc')}
				<svg class="h-4 w-4 transition-transform {open ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		{:else}
			<h4 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
				{t(locale, 'article.toc')}
			</h4>
		{/if}

		{#if !collapsible || open}
			<ul class="flex flex-col gap-1 border-l border-border {collapsible ? 'mt-3' : ''}">
				{#each items as item (item.id)}
					<li>
						<a
							href="#{item.id}"
							onclick={(e) => scrollTo(e, item.id)}
							class="block border-l-2 py-1 text-sm transition-colors {activeId === item.id
								? 'border-accent text-accent'
								: 'border-transparent text-text-muted hover:text-text-secondary'} {item.level === 2
								? 'pl-3'
								: 'pl-6'}"
						>
							{item.text}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</nav>
{/if}
