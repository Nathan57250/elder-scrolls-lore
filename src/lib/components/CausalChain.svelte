<script lang="ts">
	interface ChainItem {
		text: string;
		link?: string;
		indent?: number;
	}

	let { items }: { items: ChainItem[] } = $props();
</script>

<div class="causal-chain">
	{#each items as item, i}
		<div class="chain-item" style="padding-left: {(item.indent ?? 0) * 1.5}rem">
			<div class="chain-connector">
				<div class="chain-dot"></div>
				{#if i < items.length - 1}
					<div class="chain-line"></div>
				{/if}
			</div>
			<div class="chain-content">
				{#if item.link}
					<a href={item.link} class="chain-link">{item.text}</a>
				{:else}
					<span class="chain-text">{item.text}</span>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.causal-chain {
		margin: 1.5rem 0;
		padding: 1rem 0;
	}

	.chain-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		min-height: 2.5rem;
	}

	.chain-connector {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		width: 12px;
	}

	.chain-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--color-accent);
		flex-shrink: 0;
		margin-top: 6px;
	}

	.chain-line {
		width: 2px;
		flex: 1;
		min-height: 1.5rem;
		background: linear-gradient(to bottom, var(--color-accent), var(--color-border));
	}

	.chain-content {
		padding: 2px 0 12px;
		line-height: 1.5;
	}

	.chain-link {
		color: var(--color-accent);
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: var(--color-accent-muted);
		font-weight: 500;
		transition: color 0.15s;
	}

	.chain-link:hover {
		color: var(--color-accent-hover);
		text-decoration-color: var(--color-accent);
	}

	.chain-text {
		color: var(--color-text-secondary);
	}
</style>
