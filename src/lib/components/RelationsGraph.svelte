<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAllEntries } from '$lib/utils/content-loader';
	import { eras } from '$lib/data/eras';
	import { localePath } from '$lib/i18n/routes';
	import type { Locale } from '$lib/i18n';
	import type { LoreEntryFrontmatter, EraSlug } from '$lib/types/lore';

	interface Props {
		locale: Locale;
		centerSlug?: string;
	}

	let { locale, centerSlug }: Props = $props();

	interface GraphNode {
		id: string;
		slug: string;
		title: string;
		era: EraSlug;
		color: string;
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
	}

	interface GraphEdge {
		source: string;
		target: string;
		weight: number;
	}

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let width = $state(800);
	let height = $state(600);
	let hoveredNode: GraphNode | null = $state(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	let offsetX = $state(0);
	let offsetY = $state(0);
	let scale = $state(1);
	let isDragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let dragOffsetStartX = 0;
	let dragOffsetStartY = 0;

	let nodes: GraphNode[] = [];
	let edges: GraphEdge[] = [];
	let animationId: number;
	let hoverTime = 0;
	let isAnimating = false;
	let activeHoverNode: GraphNode | null = null;

	const eraColorMap = new Map<EraSlug, string>();
	for (const era of eras) {
		eraColorMap.set(era.slug, era.color);
	}

	function buildGraph() {
		const allEntries = getAllEntries(locale);
		const entryMap = new Map<string, LoreEntryFrontmatter>();
		for (const entry of allEntries) {
			entryMap.set(entry.slug, entry);
		}

		const edgeSet = new Map<string, number>();

		function addEdge(a: string, b: string, weight: number) {
			if (a === b) return;
			if (!entryMap.has(a) || !entryMap.has(b)) return;
			const key = [a, b].sort().join('::');
			edgeSet.set(key, (edgeSet.get(key) ?? 0) + weight);
		}

		// Build edges from relatedArticles
		for (const entry of allEntries) {
			if (entry.relatedArticles) {
				for (const related of entry.relatedArticles) {
					addEdge(entry.slug, related, 3);
				}
			}
		}

		// Build edges from shared tags (>= 2 shared tags)
		const tagIndex = new Map<string, string[]>();
		for (const entry of allEntries) {
			for (const tag of entry.tags ?? []) {
				if (!tagIndex.has(tag)) tagIndex.set(tag, []);
				tagIndex.get(tag)!.push(entry.slug);
			}
		}

		for (const [, slugs] of tagIndex) {
			if (slugs.length > 20) continue; // Skip overly common tags
			for (let i = 0; i < slugs.length; i++) {
				for (let j = i + 1; j < slugs.length; j++) {
					const a = slugs[i];
					const b = slugs[j];
					// Count shared tags between a and b
					const tagsA = entryMap.get(a)?.tags ?? [];
					const tagsB = entryMap.get(b)?.tags ?? [];
					const shared = tagsA.filter((t) => tagsB.includes(t)).length;
					if (shared >= 2) {
						addEdge(a, b, 1);
					}
				}
			}
		}

		// Determine which nodes to include
		let includedSlugs: Set<string>;

		if (centerSlug && entryMap.has(centerSlug)) {
			// Neighborhood: 1-2 degrees of separation
			includedSlugs = new Set([centerSlug]);
			const firstDegree = new Set<string>();

			for (const [key] of edgeSet) {
				const [a, b] = key.split('::');
				if (a === centerSlug) firstDegree.add(b);
				if (b === centerSlug) firstDegree.add(a);
			}

			for (const slug of firstDegree) {
				includedSlugs.add(slug);
			}

			// Second degree
			for (const [key] of edgeSet) {
				const [a, b] = key.split('::');
				if (firstDegree.has(a) && entryMap.has(b)) includedSlugs.add(b);
				if (firstDegree.has(b) && entryMap.has(a)) includedSlugs.add(a);
			}
		} else {
			// Full graph - limit to nodes that have edges, max 200
			includedSlugs = new Set<string>();
			for (const [key] of edgeSet) {
				const [a, b] = key.split('::');
				includedSlugs.add(a);
				includedSlugs.add(b);
			}
		}

		// Limit to 200 nodes (prioritize those with more connections)
		if (includedSlugs.size > 200) {
			const connectionCount = new Map<string, number>();
			for (const slug of includedSlugs) {
				connectionCount.set(slug, 0);
			}
			for (const [key] of edgeSet) {
				const [a, b] = key.split('::');
				if (includedSlugs.has(a)) connectionCount.set(a, (connectionCount.get(a) ?? 0) + 1);
				if (includedSlugs.has(b)) connectionCount.set(b, (connectionCount.get(b) ?? 0) + 1);
			}
			const sorted = [...includedSlugs].sort(
				(a, b) => (connectionCount.get(b) ?? 0) - (connectionCount.get(a) ?? 0)
			);
			includedSlugs = new Set(sorted.slice(0, 200));
			// Always include center if provided
			if (centerSlug) includedSlugs.add(centerSlug);
		}

		// Create nodes
		nodes = [];
		for (const slug of includedSlugs) {
			const entry = entryMap.get(slug);
			if (!entry) continue;
			nodes.push({
				id: slug,
				slug: entry.slug,
				title: entry.title,
				era: entry.era,
				color: eraColorMap.get(entry.era) ?? '#888888',
				x: (Math.random() - 0.5) * width * 0.8,
				y: (Math.random() - 0.5) * height * 0.8,
				vx: 0,
				vy: 0,
				radius: slug === centerSlug ? 10 : 6
			});
		}

		// Create edges (only between included nodes)
		edges = [];
		for (const [key, weight] of edgeSet) {
			const [a, b] = key.split('::');
			if (includedSlugs.has(a) && includedSlugs.has(b)) {
				edges.push({ source: a, target: b, weight });
			}
		}
	}

	function simulate(iterations: number) {
		const nodeMap = new Map<string, GraphNode>();
		for (const node of nodes) nodeMap.set(node.id, node);

		for (let iter = 0; iter < iterations; iter++) {
			// Repulsion between all nodes
			for (let i = 0; i < nodes.length; i++) {
				for (let j = i + 1; j < nodes.length; j++) {
					const a = nodes[i];
					const b = nodes[j];
					let dx = b.x - a.x;
					let dy = b.y - a.y;
					let dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 1) dist = 1;
					const force = 2000 / (dist * dist);
					const fx = (dx / dist) * force;
					const fy = (dy / dist) * force;
					a.vx -= fx;
					a.vy -= fy;
					b.vx += fx;
					b.vy += fy;
				}
			}

			// Attraction along edges
			for (const edge of edges) {
				const a = nodeMap.get(edge.source);
				const b = nodeMap.get(edge.target);
				if (!a || !b) continue;
				let dx = b.x - a.x;
				let dy = b.y - a.y;
				let dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 1) dist = 1;
				const force = (dist - 150) * 0.008 * edge.weight;
				const fx = (dx / dist) * force;
				const fy = (dy / dist) * force;
				a.vx += fx;
				a.vy += fy;
				b.vx -= fx;
				b.vy -= fy;
			}

			// Center gravity
			for (const node of nodes) {
				node.vx -= node.x * 0.001;
				node.vy -= node.y * 0.001;
			}

			// Apply velocities with damping
			const damping = 0.85;
			for (const node of nodes) {
				node.vx *= damping;
				node.vy *= damping;
				node.x += node.vx;
				node.y += node.vy;
			}
		}
	}

	function startAnimation() {
		if (isAnimating) return;
		isAnimating = true;
		function animate() {
			if (!activeHoverNode) {
				isAnimating = false;
				return;
			}
			hoverTime += 0.05;
			draw();
			animationId = requestAnimationFrame(animate);
		}
		animate();
	}

	function stopAnimation() {
		isAnimating = false;
		activeHoverNode = null;
		hoverTime = 0;
		if (animationId) cancelAnimationFrame(animationId);
		draw();
	}

	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, width, height);
		ctx.save();
		ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
		ctx.scale(scale, scale);

		const nodeMap = new Map<string, GraphNode>();
		for (const node of nodes) nodeMap.set(node.id, node);

		const hNode = activeHoverNode;

		// Draw edges
		for (const edge of edges) {
			const a = nodeMap.get(edge.source);
			const b = nodeMap.get(edge.target);
			if (!a || !b) continue;
			const isHighlighted = hNode && (hNode.id === a.id || hNode.id === b.id);
			ctx.strokeStyle = isHighlighted
				? 'rgba(255, 255, 255, 0.6)'
				: 'rgba(255, 255, 255, 0.08)';
			ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
		}

		// Draw nodes
		for (const node of nodes) {
			const isHovered = hNode === node;
			const floatOffset = isHovered ? Math.sin(hoverTime * 3) * 4 : 0;
			const pulseScale = isHovered ? 1 + Math.sin(hoverTime * 4) * 0.2 : 1;
			const drawY = node.y + floatOffset;
			const drawRadius = node.radius * pulseScale;

			// Outer glow for hovered node
			if (isHovered) {
				const gradient = ctx.createRadialGradient(node.x, drawY, drawRadius, node.x, drawY, drawRadius * 3);
				gradient.addColorStop(0, node.color + '80');
				gradient.addColorStop(1, node.color + '00');
				ctx.beginPath();
				ctx.arc(node.x, drawY, drawRadius * 3, 0, Math.PI * 2);
				ctx.fillStyle = gradient;
				ctx.fill();
			}

			ctx.beginPath();
			ctx.arc(node.x, drawY, drawRadius, 0, Math.PI * 2);
			ctx.fillStyle = node.color;
			if (isHovered) {
				ctx.shadowColor = node.color;
				ctx.shadowBlur = 20;
			} else {
				ctx.shadowBlur = 0;
			}
			ctx.fill();
			ctx.shadowBlur = 0;

			// Draw label for center node or hovered node
			if (node.id === centerSlug || isHovered) {
				ctx.font = `${isHovered ? 'bold ' : ''}11px system-ui, sans-serif`;
				ctx.textAlign = 'center';
				ctx.fillStyle = '#ffffff';
				ctx.fillText(node.title, node.x, drawY - drawRadius - 8);
			}
		}

		ctx.restore();
	}

	function screenToWorld(sx: number, sy: number): { wx: number; wy: number } {
		const wx = (sx - width / 2 - offsetX) / scale;
		const wy = (sy - height / 2 - offsetY) / scale;
		return { wx, wy };
	}

	function getNodeAt(sx: number, sy: number): GraphNode | null {
		const { wx, wy } = screenToWorld(sx, sy);
		for (let i = nodes.length - 1; i >= 0; i--) {
			const node = nodes[i];
			const dx = node.x - wx;
			const dy = node.y - wy;
			const hitRadius = (node.radius + 8) / scale;
			if (dx * dx + dy * dy < hitRadius * hitRadius) {
				return node;
			}
		}
		return null;
	}

	function handleMouseMove(e: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;

		if (isDragging) {
			offsetX = dragOffsetStartX + (e.clientX - dragStartX);
			offsetY = dragOffsetStartY + (e.clientY - dragStartY);
			draw();
			return;
		}

		const node = getNodeAt(sx, sy);
		if (node !== hoveredNode) {
			hoveredNode = node;
			activeHoverNode = node;
			canvas.style.cursor = node ? 'pointer' : 'grab';
			tooltipX = e.clientX;
			tooltipY = e.clientY;
			if (node) {
				hoverTime = 0;
				startAnimation();
			} else {
				stopAnimation();
			}
		} else if (node) {
			tooltipX = e.clientX;
			tooltipY = e.clientY;
		}
	}

	function handleMouseDown(e: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;
		const node = getNodeAt(sx, sy);

		if (!node) {
			isDragging = true;
			dragStartX = e.clientX;
			dragStartY = e.clientY;
			dragOffsetStartX = offsetX;
			dragOffsetStartY = offsetY;
			canvas.style.cursor = 'grabbing';
		}
	}

	function handleMouseUp(e: MouseEvent) {
		if (isDragging) {
			isDragging = false;
			canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
			return;
		}

		const rect = canvas.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;
		const node = getNodeAt(sx, sy);
		if (node) {
			goto(localePath(locale, 'timeline', node.era, node.slug));
		}
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
		const newScale = Math.max(0.3, Math.min(5, scale * zoomFactor));

		// Zoom toward cursor
		const rect = canvas.getBoundingClientRect();
		const mx = e.clientX - rect.left - width / 2 - offsetX;
		const my = e.clientY - rect.top - height / 2 - offsetY;

		offsetX -= mx * (newScale / scale - 1);
		offsetY -= my * (newScale / scale - 1);
		scale = newScale;
		draw();
	}

	function handleMouseLeave() {
		hoveredNode = null;
		activeHoverNode = null;
		isDragging = false;
		stopAnimation();
	}

	function updateSize() {
		if (!container) return;
		width = container.clientWidth;
		height = container.clientHeight;
		if (canvas) {
			canvas.width = width;
			canvas.height = height;
		}
		draw();
	}

	onMount(() => {
		updateSize();
		buildGraph();
		simulate(150);
		draw();

		const resizeObserver = new ResizeObserver(() => {
			updateSize();
		});
		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
			if (animationId) cancelAnimationFrame(animationId);
		};
	});
</script>

<div class="relative h-full w-full" bind:this={container}>
	<canvas
		bind:this={canvas}
		{width}
		{height}
		class="h-full w-full cursor-grab rounded-lg bg-bg-elevated"
		onmousemove={handleMouseMove}
		onmousedown={handleMouseDown}
		onmouseup={handleMouseUp}
		onwheel={handleWheel}
		onmouseleave={handleMouseLeave}
		role="img"
		aria-label="Relationship graph"
	></canvas>

	{#if hoveredNode}
		<div
			class="pointer-events-none fixed z-50 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text shadow-lg"
			style="left: {tooltipX + 12}px; top: {tooltipY - 30}px;"
		>
			{hoveredNode.title}
		</div>
	{/if}

	<!-- Legend -->
	<div class="absolute bottom-3 left-3 flex flex-wrap gap-2 rounded-md border border-border bg-surface/90 px-3 py-2 text-xs backdrop-blur-sm">
		{#each eras as era}
			<span class="flex items-center gap-1">
				<span class="inline-block h-2.5 w-2.5 rounded-full" style="background-color: {era.color}"></span>
				<span class="text-text-secondary">{era.names[locale]}</span>
			</span>
		{/each}
	</div>
</div>
