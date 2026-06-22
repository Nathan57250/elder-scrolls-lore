<script lang="ts">
	import { onMount } from 'svelte';

	interface TocItem {
		id: string;
		text: string;
		level: number;
	}

	let items = $state<TocItem[]>([]);
	let activeId = $state<string>('');

	onMount(() => {
		const headings = document.querySelectorAll('.lore-content h2, .lore-content h3');
		items = Array.from(headings).map((h) => ({
			id: h.id || h.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
			text: h.textContent || '',
			level: parseInt(h.tagName[1])
		}));

		headings.forEach((h) => {
			if (!h.id) {
				h.id = h.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
			}
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
</script>

{#if items.length > 0}
	<nav class="sticky top-24 hidden xl:block" aria-label="Sommaire">
		<h4 class="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
			Sommaire
		</h4>
		<ul class="flex flex-col gap-1 border-l border-border">
			{#each items as item}
				<li>
					<a
						href="#{item.id}"
						class="block border-l-2 py-1 text-sm transition-colors {activeId === item.id ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-secondary'} {item.level === 2 ? 'pl-3' : 'pl-6'}"
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
