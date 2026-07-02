<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';

	let { locale }: { locale: Locale } = $props();

	interface TocItem {
		id: string;
		text: string;
		level: number;
	}

	let items = $state<TocItem[]>([]);
	let activeId = $state<string>('');

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
	<nav aria-label={t(locale, 'article.toc')}>
		<h4 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			{t(locale, 'article.toc')}
		</h4>
		<ul class="flex flex-col gap-1 border-l border-border">
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
	</nav>
{/if}
