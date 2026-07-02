<script lang="ts">
	import { t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';
	import { lineages, type LineageMember } from '$lib/data/lineages';
	import { getAllEntries } from '$lib/utils/content-loader';
	import { localePath } from '$lib/i18n/routes';

	let { locale }: { locale: Locale } = $props();

	let selectedLineageId = $state(lineages[0].id);
	let scale = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let isPanning = $state(false);
	let startX = $state(0);
	let startY = $state(0);
	let isMobile = $state(false);

	const selectedLineage = $derived(lineages.find((l) => l.id === selectedLineageId)!);

	const existingSlugs = $derived(new Set(getAllEntries(locale).map((e) => e.slug)));

	// Layout constants
	const NODE_WIDTH = 180;
	const NODE_HEIGHT = 60;
	const H_GAP = 40;
	const V_GAP = 80;

	interface LayoutNode {
		member: LineageMember;
		x: number;
		y: number;
		width: number;
		children: LayoutNode[];
	}

	function computeSubtreeWidth(member: LineageMember): number {
		if (!member.children || member.children.length === 0) {
			return NODE_WIDTH;
		}
		const childrenWidth = member.children.reduce(
			(sum, child) => sum + computeSubtreeWidth(child),
			0
		);
		const gaps = (member.children.length - 1) * H_GAP;
		return Math.max(NODE_WIDTH, childrenWidth + gaps);
	}

	function layoutTree(members: LineageMember[], startX: number, startY: number): LayoutNode[] {
		const nodes: LayoutNode[] = [];
		let currentX = startX;

		for (const member of members) {
			const subtreeWidth = computeSubtreeWidth(member);
			const nodeX = currentX + subtreeWidth / 2 - NODE_WIDTH / 2;
			const childNodes = member.children
				? layoutTree(member.children, currentX, startY + NODE_HEIGHT + V_GAP)
				: [];
			nodes.push({
				member,
				x: nodeX,
				y: startY,
				width: subtreeWidth,
				children: childNodes
			});
			currentX += subtreeWidth + H_GAP;
		}

		return nodes;
	}

	const treeLayout = $derived(layoutTree(selectedLineage.members, 0, 0));

	function getTotalWidth(nodes: LayoutNode[]): number {
		if (nodes.length === 0) return 0;
		const last = nodes[nodes.length - 1];
		return last.x + NODE_WIDTH;
	}

	function getTotalHeight(nodes: LayoutNode[]): number {
		let maxY = 0;
		function walk(nodeList: LayoutNode[]) {
			for (const node of nodeList) {
				if (node.y + NODE_HEIGHT > maxY) maxY = node.y + NODE_HEIGHT;
				if (node.children.length > 0) walk(node.children);
			}
		}
		walk(nodes);
		return maxY;
	}

	const svgWidth = $derived(Math.max(getTotalWidth(treeLayout) + 40, 400));
	const svgHeight = $derived(Math.max(getTotalHeight(treeLayout) + 40, 300));

	function hasArticle(member: LineageMember): boolean {
		return !!member.slug && existingSlugs.has(member.slug);
	}

	function getArticleUrl(member: LineageMember): string {
		if (!member.slug) return '#';
		const entries = getAllEntries(locale);
		const entry = entries.find((e) => e.slug === member.slug);
		if (!entry) return '#';
		return localePath(locale, 'timeline', entry.era, entry.slug);
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.1 : 0.1;
		scale = Math.max(0.3, Math.min(3, scale + delta));
	}

	function handlePointerDown(e: PointerEvent) {
		if (e.button === 0) {
			isPanning = true;
			startX = e.clientX - panX;
			startY = e.clientY - panY;
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		}
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isPanning) return;
		panX = e.clientX - startX;
		panY = e.clientY - startY;
	}

	function handlePointerUp() {
		isPanning = false;
	}

	function resetView() {
		scale = 1;
		panX = 0;
		panY = 0;
	}

	function zoomIn() {
		scale = Math.min(3, scale + 0.2);
	}

	function zoomOut() {
		scale = Math.max(0.3, scale - 0.2);
	}

	$effect(() => {
		function checkMobile() {
			isMobile = window.innerWidth < 768;
		}
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	// Flatten tree for mobile list view
	function flattenTree(members: LineageMember[], depth: number = 0): { member: LineageMember; depth: number }[] {
		const result: { member: LineageMember; depth: number }[] = [];
		for (const member of members) {
			result.push({ member, depth });
			if (member.children) {
				result.push(...flattenTree(member.children, depth + 1));
			}
		}
		return result;
	}

	const flatMembers = $derived(flattenTree(selectedLineage.members));
</script>

<div class="flex h-full flex-col gap-4">
	<!-- Dynasty selector -->
	<div class="flex flex-wrap items-center gap-2">
		<span class="text-sm font-medium text-text-secondary">
			{t(locale, 'lineages.select')}
		</span>
		<div class="flex flex-wrap gap-1">
			{#each lineages as lineage}
				<button
					onclick={() => { selectedLineageId = lineage.id; resetView(); }}
					class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
					class:bg-surface-hover={selectedLineageId === lineage.id}
					class:text-text={selectedLineageId === lineage.id}
					class:text-text-secondary={selectedLineageId !== lineage.id}
					style={selectedLineageId === lineage.id ? `border: 1px solid ${lineage.color}; box-shadow: 0 0 8px ${lineage.color}40` : 'border: 1px solid transparent'}
				>
					<span class="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style="background: {lineage.color}"></span>
					{lineage.names[locale]}
				</button>
			{/each}
		</div>
	</div>

	<!-- Description -->
	<p class="text-sm text-text-secondary">{selectedLineage.description[locale]}</p>

	<!-- Tree visualization (desktop) / List view (mobile) -->
	{#if isMobile}
		<!-- Mobile: simplified list view -->
		<div class="flex-1 overflow-y-auto rounded-lg border border-border bg-bg-elevated p-4">
			<ul class="space-y-1">
				{#each flatMembers as { member, depth }}
					<li style="padding-left: {depth * 1.5}rem" class="flex items-start gap-2 py-1.5">
						{#if depth > 0}
							<span class="mt-2 h-px w-3 flex-shrink-0" style="background: {selectedLineage.color}"></span>
						{/if}
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								{#if hasArticle(member)}
									<a
										href={getArticleUrl(member)}
										class="font-medium text-accent hover:underline"
									>
										{member.names[locale]}
									</a>
								{:else}
									<span class="font-medium text-text">{member.names[locale]}</span>
								{/if}
							</div>
							{#if member.title}
								<p class="text-xs text-text-secondary">{member.title[locale]}</p>
							{/if}
							{#if member.reign}
								<p class="text-xs text-text-secondary">
									{t(locale, 'lineages.reign')}: {member.reign}
								</p>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<!-- Desktop: SVG tree with pan/zoom -->
		<div class="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-bg-elevated">
			<!-- Zoom controls -->
			<div class="absolute right-3 top-3 z-10 flex flex-col gap-1">
				<button
					onclick={zoomIn}
					class="rounded bg-surface p-1.5 text-text-secondary shadow hover:bg-surface-hover hover:text-text"
					aria-label="Zoom in"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12M6 12h12" />
					</svg>
				</button>
				<button
					onclick={zoomOut}
					class="rounded bg-surface p-1.5 text-text-secondary shadow hover:bg-surface-hover hover:text-text"
					aria-label="Zoom out"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h12" />
					</svg>
				</button>
				<button
					onclick={resetView}
					class="rounded bg-surface p-1.5 text-text-secondary shadow hover:bg-surface-hover hover:text-text"
					aria-label="Reset view"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</button>
			</div>

			<!-- SVG container with pan/zoom -->
			<div
				class="h-full w-full cursor-grab active:cursor-grabbing"
				role="application"
				aria-label="Family tree visualization"
				onwheel={handleWheel}
				onpointerdown={handlePointerDown}
				onpointermove={handlePointerMove}
				onpointerup={handlePointerUp}
				onpointercancel={handlePointerUp}
			>
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 {svgWidth} {svgHeight}"
					style="transform: translate({panX}px, {panY}px) scale({scale}); transform-origin: center center;"
					class="transition-transform duration-75"
				>
					<!-- Render connections -->
					{#snippet renderConnections(nodes: LayoutNode[])}
						{#each nodes as node}
							{#if node.children.length > 0}
								{#each node.children as child}
									<line
										x1={node.x + NODE_WIDTH / 2}
										y1={node.y + NODE_HEIGHT}
										x2={child.x + NODE_WIDTH / 2}
										y2={child.y}
										stroke={selectedLineage.color}
										stroke-width="2"
										stroke-opacity="0.6"
									/>
								{/each}
								{@render renderConnections(node.children)}
							{/if}
						{/each}
					{/snippet}

					{@render renderConnections(treeLayout)}

					<!-- Render nodes -->
					{#snippet renderNodes(nodes: LayoutNode[])}
						{#each nodes as node}
							{@const clickable = hasArticle(node.member)}
							<g class="tree-node" class:tree-node--clickable={clickable}>
								{#if clickable}
									<a href={getArticleUrl(node.member)}>
										<rect
											x={node.x}
											y={node.y}
											width={NODE_WIDTH}
											height={NODE_HEIGHT}
											rx="8"
											ry="8"
											fill="var(--color-surface, #1a1a2e)"
											stroke={selectedLineage.color}
											stroke-width="2"
											class="tree-node__rect"
										/>
										<text
											x={node.x + NODE_WIDTH / 2}
											y={node.y + 22}
											text-anchor="middle"
											fill="var(--color-accent, #c9a227)"
											font-size="12"
											font-weight="600"
										>
											{node.member.names[locale]}
										</text>
										{#if node.member.reign}
											<text
												x={node.x + NODE_WIDTH / 2}
												y={node.y + 42}
												text-anchor="middle"
												fill="var(--color-text-secondary, #888)"
												font-size="10"
											>
												{node.member.reign}
											</text>
										{:else if node.member.title}
											<text
												x={node.x + NODE_WIDTH / 2}
												y={node.y + 42}
												text-anchor="middle"
												fill="var(--color-text-secondary, #888)"
												font-size="10"
											>
												{node.member.title[locale]}
											</text>
										{/if}
									</a>
								{:else}
									<rect
										x={node.x}
										y={node.y}
										width={NODE_WIDTH}
										height={NODE_HEIGHT}
										rx="8"
										ry="8"
										fill="var(--color-surface, #1a1a2e)"
										stroke={selectedLineage.color}
										stroke-width="1.5"
										stroke-opacity="0.5"
									/>
									<text
										x={node.x + NODE_WIDTH / 2}
										y={node.y + 22}
										text-anchor="middle"
										fill="var(--color-text, #eee)"
										font-size="12"
										font-weight="500"
									>
										{node.member.names[locale]}
									</text>
									{#if node.member.reign}
										<text
											x={node.x + NODE_WIDTH / 2}
											y={node.y + 42}
											text-anchor="middle"
											fill="var(--color-text-secondary, #888)"
											font-size="10"
										>
											{node.member.reign}
										</text>
									{:else if node.member.title}
										<text
											x={node.x + NODE_WIDTH / 2}
											y={node.y + 42}
											text-anchor="middle"
											fill="var(--color-text-secondary, #888)"
											font-size="10"
										>
											{node.member.title[locale]}
										</text>
									{/if}
								{/if}
							</g>
							{#if node.children.length > 0}
								{@render renderNodes(node.children)}
							{/if}
						{/each}
					{/snippet}

					{@render renderNodes(treeLayout)}
				</svg>
			</div>
		</div>
	{/if}
</div>

<style>
	.tree-node--clickable .tree-node__rect {
		transition: filter 0.2s ease, stroke-width 0.2s ease;
	}

	.tree-node--clickable:hover .tree-node__rect {
		filter: drop-shadow(0 0 8px var(--color-accent, #c9a227));
		stroke-width: 3;
	}
</style>
