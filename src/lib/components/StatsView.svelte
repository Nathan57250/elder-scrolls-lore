<script lang="ts">
	import { t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';
	import { getReadingProgressState } from '$lib/stores/reading-progress.svelte';
	import { getAllEntries } from '$lib/utils/content-loader';
	import { eras, getEraName } from '$lib/data/eras';
	import { categories, getCategoryName } from '$lib/data/categories';
	import { onMount } from 'svelte';

	let { locale }: { locale: Locale } = $props();

	const progressState = getReadingProgressState();

	let mounted = $state(false);

	onMount(() => {
		progressState.init();
		mounted = true;
	});

	const allArticles = $derived(getAllEntries(locale));
	const allProgress = $derived(mounted ? progressState.getAllProgress() : {});

	// Overview stats
	const articlesRead = $derived(
		allArticles.filter((a) => (allProgress[a.slug] ?? 0) > 0).length
	);
	const articlesCompleted = $derived(
		allArticles.filter((a) => (allProgress[a.slug] ?? 0) === 100).length
	);
	const overallPercent = $derived(
		allArticles.length > 0 ? Math.round((articlesCompleted / allArticles.length) * 100) : 0
	);

	// Era breakdown
	const eraStats = $derived(
		eras.map((era) => {
			const eraArticles = allArticles.filter((a) => a.era === era.slug);
			const eraRead = eraArticles.filter((a) => (allProgress[a.slug] ?? 0) > 0).length;
			const eraCompleted = eraArticles.filter((a) => (allProgress[a.slug] ?? 0) === 100).length;
			return {
				era,
				total: eraArticles.length,
				read: eraRead,
				completed: eraCompleted,
				percent: eraArticles.length > 0 ? Math.round((eraRead / eraArticles.length) * 100) : 0
			};
		})
	);

	// Category breakdown
	const categoryStats = $derived(
		categories.map((cat) => {
			const catArticles = allArticles.filter((a) => a.category === cat.slug);
			const catRead = catArticles.filter((a) => (allProgress[a.slug] ?? 0) > 0).length;
			return {
				category: cat,
				total: catArticles.length,
				read: catRead,
				percent: catArticles.length > 0 ? Math.round((catRead / catArticles.length) * 100) : 0
			};
		})
	);

	// Reading streak
	const activityDates = $derived(mounted ? progressState.getActivityDates() : []);

	const currentStreak = $derived.by(() => {
		if (activityDates.length === 0) return 0;
		const sorted = [...activityDates].sort().reverse();
		const today = new Date().toISOString().slice(0, 10);
		const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

		// Check if the streak includes today or yesterday
		if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

		let streak = 1;
		for (let i = 1; i < sorted.length; i++) {
			const prev = new Date(sorted[i - 1]);
			const curr = new Date(sorted[i]);
			const diff = (prev.getTime() - curr.getTime()) / 86400000;
			if (diff === 1) {
				streak++;
			} else {
				break;
			}
		}
		return streak;
	});

	const bestStreak = $derived.by(() => {
		if (activityDates.length === 0) return 0;
		const sorted = [...activityDates].sort();
		let best = 1;
		let current = 1;
		for (let i = 1; i < sorted.length; i++) {
			const prev = new Date(sorted[i - 1]);
			const curr = new Date(sorted[i]);
			const diff = (curr.getTime() - prev.getTime()) / 86400000;
			if (diff === 1) {
				current++;
				best = Math.max(best, current);
			} else if (diff > 1) {
				current = 1;
			}
		}
		return best;
	});

	// Calendar heatmap (last 30 days)
	const last30Days = $derived.by(() => {
		const days: { date: string; level: number }[] = [];
		const today = new Date();
		for (let i = 29; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(d.getDate() - i);
			const dateStr = d.toISOString().slice(0, 10);
			const isActive = activityDates.includes(dateStr);
			days.push({ date: dateStr, level: isActive ? 1 : 0 });
		}
		return days;
	});

	// Achievements
	const achievements = $derived.by(() => {
		const earned: { key: string; label: string; unlocked: boolean }[] = [];

		// First Steps
		earned.push({
			key: 'firstSteps',
			label: t(locale, 'stats.achievement.firstSteps'),
			unlocked: articlesRead >= 1
		});

		// Scholar
		earned.push({
			key: 'scholar',
			label: t(locale, 'stats.achievement.scholar'),
			unlocked: articlesRead >= 10
		});

		// Loremaster
		earned.push({
			key: 'loremaster',
			label: t(locale, 'stats.achievement.loremaster'),
			unlocked: articlesRead >= 50
		});

		// Era Expert for each era
		for (const eraStat of eraStats) {
			if (eraStat.total > 0) {
				earned.push({
					key: `eraExpert-${eraStat.era.slug}`,
					label: t(locale, 'stats.achievement.eraExpert', { era: getEraName(eraStat.era, locale) }),
					unlocked: eraStat.completed === eraStat.total
				});
			}
		}

		// Completionist
		earned.push({
			key: 'completionist',
			label: t(locale, 'stats.achievement.completionist'),
			unlocked: articlesCompleted === allArticles.length && allArticles.length > 0
		});

		// Streak Master
		earned.push({
			key: 'streakMaster',
			label: t(locale, 'stats.achievement.streakMaster'),
			unlocked: bestStreak >= 7
		});

		return earned;
	});

	// Top Tags
	const topTags = $derived.by(() => {
		const tagCounts = new Map<string, number>();
		for (const article of allArticles) {
			if ((allProgress[article.slug] ?? 0) > 0) {
				for (const tag of article.tags ?? []) {
					tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
				}
			}
		}
		return Array.from(tagCounts.entries())
			.map(([tag, count]) => ({ tag, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 15);
	});
</script>

<div class="mx-auto max-w-5xl space-y-10 px-4 py-8">
	<!-- Page Title -->
	<h1 class="text-3xl font-bold tracking-tight text-text">
		{t(locale, 'stats.title')}
	</h1>

	<!-- Overview Section -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text">{t(locale, 'stats.overview')}</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<!-- Circular progress -->
			<div class="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-6">
				<div class="relative h-32 w-32">
					<svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
						<circle
							cx="50"
							cy="50"
							r="42"
							fill="none"
							stroke="currentColor"
							stroke-width="8"
							class="text-border"
						/>
						<circle
							cx="50"
							cy="50"
							r="42"
							fill="none"
							stroke="currentColor"
							stroke-width="8"
							stroke-dasharray={2 * Math.PI * 42}
							stroke-dashoffset={2 * Math.PI * 42 * (1 - overallPercent / 100)}
							stroke-linecap="round"
							class="text-accent transition-all duration-700"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-2xl font-bold text-text">{overallPercent}%</span>
					</div>
				</div>
				<p class="mt-2 text-sm text-text-secondary">{t(locale, 'stats.completed')}</p>
			</div>

			<!-- Articles read -->
			<div class="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-6">
				<span class="text-4xl font-bold text-text">{articlesRead}</span>
				<span class="text-lg text-text-muted">/ {allArticles.length}</span>
				<p class="mt-2 text-sm text-text-secondary">{t(locale, 'stats.articlesRead')}</p>
			</div>

			<!-- Articles completed -->
			<div class="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-6">
				<span class="text-4xl font-bold text-text">{articlesCompleted}</span>
				<span class="text-lg text-text-muted">/ {allArticles.length}</span>
				<p class="mt-2 text-sm text-text-secondary">{t(locale, 'stats.completed')}</p>
			</div>
		</div>
	</section>

	<!-- Era Breakdown -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text">{t(locale, 'stats.byEra')}</h2>
		<div class="space-y-3 rounded-xl border border-border bg-surface p-6">
			{#each eraStats as stat}
				<div class="space-y-1">
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-text">{getEraName(stat.era, locale)}</span>
						<span class="text-text-secondary">{stat.read}/{stat.total} ({stat.percent}%)</span>
					</div>
					<div class="h-3 w-full overflow-hidden rounded-full bg-bg">
						<div
							class="h-full rounded-full transition-all duration-500"
							style="width: {stat.percent}%; background-color: {stat.era.color};"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Category Breakdown -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text">{t(locale, 'stats.byCategory')}</h2>
		<div class="space-y-3 rounded-xl border border-border bg-surface p-6">
			{#each categoryStats as stat}
				<div class="space-y-1">
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-text">
							<span class="mr-1">{stat.category.icon}</span>
							{getCategoryName(stat.category, locale)}
						</span>
						<span class="text-text-secondary">{stat.read}/{stat.total} ({stat.percent}%)</span>
					</div>
					<div class="h-3 w-full overflow-hidden rounded-full bg-bg">
						<div
							class="h-full rounded-full transition-all duration-500"
							style="width: {stat.percent}%; background-color: {stat.category.color};"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Reading Streak -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text">{t(locale, 'stats.streak')}</h2>
		<div class="rounded-xl border border-border bg-surface p-6">
			<div class="mb-6 grid grid-cols-2 gap-4">
				<div class="text-center">
					<span class="text-3xl font-bold text-text">{currentStreak}</span>
					<p class="text-sm text-text-secondary">{t(locale, 'stats.currentStreak')}</p>
					<p class="text-xs text-text-muted">{t(locale, 'stats.days')}</p>
				</div>
				<div class="text-center">
					<span class="text-3xl font-bold text-text">{bestStreak}</span>
					<p class="text-sm text-text-secondary">{t(locale, 'stats.bestStreak')}</p>
					<p class="text-xs text-text-muted">{t(locale, 'stats.days')}</p>
				</div>
			</div>

			<!-- Heatmap -->
			<div class="flex flex-wrap gap-1">
				{#each last30Days as day}
					<div
						class="h-4 w-4 rounded-sm transition-colors {day.level > 0 ? 'bg-accent' : 'bg-bg'}"
						title={day.date}
					></div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Achievements -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text">{t(locale, 'stats.achievements')}</h2>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
			{#each achievements as achievement}
				<div
					class="flex flex-col items-center rounded-xl border p-4 text-center transition-all
						{achievement.unlocked
							? 'border-accent/50 bg-surface shadow-[0_0_12px_rgba(var(--color-accent-rgb,139,92,246),0.3)]'
							: 'border-border bg-surface opacity-40 grayscale'}"
				>
					<div class="mb-2 text-2xl">
						{#if achievement.key === 'firstSteps'}
							&#128694;
						{:else if achievement.key === 'scholar'}
							&#128218;
						{:else if achievement.key === 'loremaster'}
							&#127942;
						{:else if achievement.key.startsWith('eraExpert')}
							&#11088;
						{:else if achievement.key === 'completionist'}
							&#128081;
						{:else if achievement.key === 'streakMaster'}
							&#128293;
						{/if}
					</div>
					<span class="text-xs font-medium text-text">{achievement.label}</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Top Tags -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text">{t(locale, 'stats.topTags')}</h2>
		<div class="rounded-xl border border-border bg-surface p-6">
			{#if topTags.length === 0}
				<p class="text-sm text-text-muted">---</p>
			{:else}
				<div class="flex flex-wrap gap-2">
					{#each topTags as { tag, count }}
						<span class="inline-flex items-center gap-1 rounded-full border border-border bg-bg px-3 py-1 text-sm text-text-secondary">
							{tag}
							<span class="rounded-full bg-accent/20 px-1.5 text-xs font-medium text-accent">{count}</span>
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</section>
</div>
