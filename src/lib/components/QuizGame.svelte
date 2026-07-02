<script lang="ts">
	import { t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';
	import { localePath } from '$lib/i18n/routes';
	import { getAllEntries } from '$lib/utils/content-loader';
	import { eras, getEra } from '$lib/data/eras';
	import { categories, getCategory } from '$lib/data/categories';
	import type { LoreEntryFrontmatter } from '$lib/types/lore';

	let { locale }: { locale: Locale } = $props();

	type QuestionType = 'era' | 'category' | 'summary' | 'related';

	interface Question {
		type: QuestionType;
		text: string;
		choices: string[];
		correctIndex: number;
		article: LoreEntryFrontmatter;
		eraColor: string;
	}

	type Difficulty = 'easy' | 'medium' | 'hard';
	type Phase = 'start' | 'playing' | 'finished';

	const difficultyCount: Record<Difficulty, number> = { easy: 5, medium: 10, hard: 20 };

	let phase = $state<Phase>('start');
	let difficulty = $state<Difficulty>('medium');
	let questions = $state<Question[]>([]);
	let currentIndex = $state(0);
	let score = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let highScore = $state(loadHighScore());
	let animatedScore = $state(0);

	const currentQuestion = $derived(questions[currentIndex]);
	const progress = $derived(questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0);
	const isAnswered = $derived(selectedAnswer !== null);

	function loadHighScore(): number {
		if (typeof localStorage === 'undefined') return 0;
		const stored = localStorage.getItem(`quiz-highscore-${locale}`);
		return stored ? parseInt(stored, 10) : 0;
	}

	function saveHighScore(value: number) {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem(`quiz-highscore-${locale}`, String(value));
	}

	function shuffle<T>(arr: T[]): T[] {
		const copy = [...arr];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	function pickRandom<T>(arr: T[], count: number, exclude: T[] = []): T[] {
		let pool = exclude.length > 0 ? arr.filter((x) => !exclude.includes(x)) : [...arr];
		pool = shuffle(pool);
		return pool.slice(0, count);
	}

	function generateEraQuestion(article: LoreEntryFrontmatter): Question | null {
		const correctEra = getEra(article.era);
		if (!correctEra) return null;
		const correctAnswer = correctEra.names[locale];
		const otherEras = eras.filter((e) => e.slug !== article.era);
		const wrongAnswers = pickRandom(otherEras, 3).map((e) => e.names[locale]);
		const choices = shuffle([correctAnswer, ...wrongAnswers]);
		return {
			type: 'era',
			text: t(locale, 'quiz.question.era', { title: article.title }),
			choices,
			correctIndex: choices.indexOf(correctAnswer),
			article,
			eraColor: correctEra.color
		};
	}

	function generateCategoryQuestion(article: LoreEntryFrontmatter): Question | null {
		const correctCat = getCategory(article.category);
		if (!correctCat) return null;
		const correctAnswer = correctCat.names[locale];
		const otherCats = categories.filter((c) => c.slug !== article.category);
		const wrongAnswers = pickRandom(otherCats, 3).map((c) => c.names[locale]);
		const choices = shuffle([correctAnswer, ...wrongAnswers]);
		return {
			type: 'category',
			text: t(locale, 'quiz.question.category', { title: article.title }),
			choices,
			correctIndex: choices.indexOf(correctAnswer),
			article,
			eraColor: getEra(article.era)?.color ?? '#888'
		};
	}

	function generateSummaryQuestion(article: LoreEntryFrontmatter, allArticles: LoreEntryFrontmatter[]): Question | null {
		if (!article.summary || article.summary.length < 20) return null;
		const correctAnswer = article.title;
		const others = allArticles.filter((a) => a.slug !== article.slug);
		if (others.length < 3) return null;
		const wrongAnswers = pickRandom(others, 3).map((a) => a.title);
		const choices = shuffle([correctAnswer, ...wrongAnswers]);
		return {
			type: 'summary',
			text: t(locale, 'quiz.question.summary'),
			choices,
			correctIndex: choices.indexOf(correctAnswer),
			article,
			eraColor: getEra(article.era)?.color ?? '#888'
		};
	}

	function generateRelatedQuestion(article: LoreEntryFrontmatter, allArticles: LoreEntryFrontmatter[]): Question | null {
		if (!article.relatedArticles || article.relatedArticles.length === 0) return null;
		const relatedSlug = article.relatedArticles[Math.floor(Math.random() * article.relatedArticles.length)];
		const relatedArticle = allArticles.find((a) => a.slug === relatedSlug);
		if (!relatedArticle) return null;
		const correctAnswer = relatedArticle.title;
		const others = allArticles.filter((a) => a.slug !== article.slug && a.slug !== relatedSlug);
		if (others.length < 3) return null;
		const wrongAnswers = pickRandom(others, 3).map((a) => a.title);
		const choices = shuffle([correctAnswer, ...wrongAnswers]);
		return {
			type: 'related',
			text: t(locale, 'quiz.question.related', { title: article.title }),
			choices,
			correctIndex: choices.indexOf(correctAnswer),
			article,
			eraColor: getEra(article.era)?.color ?? '#888'
		};
	}

	function generateQuestions(count: number): Question[] {
		const allArticles = getAllEntries(locale);
		if (allArticles.length === 0) return [];

		const generators = [generateEraQuestion, generateCategoryQuestion, generateSummaryQuestion, generateRelatedQuestion];
		const generated: Question[] = [];
		const usedArticleSlugs = new Set<string>();
		const shuffledArticles = shuffle(allArticles);
		let attempts = 0;
		const maxAttempts = count * 10;

		while (generated.length < count && attempts < maxAttempts) {
			attempts++;
			const article = shuffledArticles[attempts % shuffledArticles.length];
			const genFn = generators[Math.floor(Math.random() * generators.length)];

			let question: Question | null = null;
			if (genFn === generateSummaryQuestion || genFn === generateRelatedQuestion) {
				question = genFn(article, allArticles);
			} else {
				question = (genFn as (a: LoreEntryFrontmatter) => Question | null)(article);
			}

			if (question && !usedArticleSlugs.has(`${article.slug}-${question.type}`)) {
				usedArticleSlugs.add(`${article.slug}-${question.type}`);
				generated.push(question);
			}
		}

		return shuffle(generated);
	}

	function startQuiz() {
		questions = generateQuestions(difficultyCount[difficulty]);
		currentIndex = 0;
		score = 0;
		animatedScore = 0;
		selectedAnswer = null;
		phase = 'playing';
	}

	function selectAnswer(index: number) {
		if (isAnswered) return;
		selectedAnswer = index;
		if (index === currentQuestion.correctIndex) {
			score++;
			animateScore();
		}
	}

	function animateScore() {
		const target = score;
		const start = animatedScore;
		const duration = 300;
		const startTime = performance.now();
		function tick(now: number) {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			animatedScore = Math.round(start + (target - start) * progress);
			if (progress < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	function nextQuestion() {
		if (currentIndex < questions.length - 1) {
			currentIndex++;
			selectedAnswer = null;
		} else {
			phase = 'finished';
			if (score > highScore) {
				highScore = score;
				saveHighScore(score);
			}
		}
	}

	function retry() {
		phase = 'start';
		selectedAnswer = null;
	}

	function getArticleUrl(article: LoreEntryFrontmatter): string {
		return localePath(locale, 'timeline', article.era, article.slug);
	}

	function getButtonClass(index: number): string {
		const base = 'w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-200';
		if (!isAnswered) {
			return `${base} border-border bg-surface hover:bg-surface-hover hover:border-accent text-text cursor-pointer`;
		}
		if (index === currentQuestion.correctIndex) {
			return `${base} border-green-500 bg-green-500/10 text-green-400`;
		}
		if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
			return `${base} border-red-500 bg-red-500/10 text-red-400`;
		}
		return `${base} border-border bg-surface text-text-secondary opacity-50`;
	}
</script>

{#if phase === 'start'}
	<div class="rounded-xl border border-border bg-bg-elevated p-8 text-center">
		<div class="mb-6">
			<svg class="mx-auto h-16 w-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
			</svg>
		</div>

		{#if highScore > 0}
			<p class="mb-4 text-sm text-text-secondary">
				{t(locale, 'quiz.highscore')}: {highScore}
			</p>
		{/if}

		<div class="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
			<button
				onclick={() => (difficulty = 'easy')}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {difficulty === 'easy' ? 'bg-accent text-white' : 'bg-surface text-text-secondary hover:text-text'}"
			>
				{t(locale, 'quiz.difficulty.easy')}
			</button>
			<button
				onclick={() => (difficulty = 'medium')}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {difficulty === 'medium' ? 'bg-accent text-white' : 'bg-surface text-text-secondary hover:text-text'}"
			>
				{t(locale, 'quiz.difficulty.medium')}
			</button>
			<button
				onclick={() => (difficulty = 'hard')}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {difficulty === 'hard' ? 'bg-accent text-white' : 'bg-surface text-text-secondary hover:text-text'}"
			>
				{t(locale, 'quiz.difficulty.hard')}
			</button>
		</div>

		<button
			onclick={startQuiz}
			class="rounded-lg bg-accent px-8 py-3 text-lg font-semibold text-white transition-transform hover:scale-105"
		>
			{t(locale, 'quiz.start')}
		</button>
	</div>

{:else if phase === 'playing' && currentQuestion}
	<div class="space-y-6">
		<!-- Progress bar -->
		<div class="flex items-center gap-3">
			<div class="flex-1 overflow-hidden rounded-full bg-surface">
				<div
					class="h-2 rounded-full transition-all duration-500"
					style="width: {progress}%; background-color: {currentQuestion.eraColor}"
				></div>
			</div>
			<span class="text-sm font-medium text-text-secondary">
				{currentIndex + 1}/{questions.length}
			</span>
		</div>

		<!-- Score -->
		<div class="text-center">
			<span class="text-sm font-medium text-text-secondary">
				{t(locale, 'quiz.score', { score: animatedScore, total: questions.length })}
			</span>
		</div>

		<!-- Question card -->
		<div class="rounded-xl border border-border bg-bg-elevated p-6" style="border-top: 3px solid {currentQuestion.eraColor}">
			{#if currentQuestion.type === 'summary' && currentQuestion.article.summary}
				<blockquote class="mb-4 border-l-2 border-text-secondary/30 pl-4 text-sm italic text-text-secondary">
					{currentQuestion.article.summary.length > 150
						? currentQuestion.article.summary.slice(0, 150) + '...'
						: currentQuestion.article.summary}
				</blockquote>
			{/if}

			<h2 class="mb-6 text-lg font-semibold text-text">
				{currentQuestion.text}
			</h2>

			<div class="grid gap-3">
				{#each currentQuestion.choices as choice, i}
					<button
						onclick={() => selectAnswer(i)}
						class={getButtonClass(i)}
						disabled={isAnswered}
					>
						<span class="mr-2 inline-block h-5 w-5 rounded-full border border-current text-center text-xs leading-5">
							{String.fromCharCode(65 + i)}
						</span>
						{choice}
					</button>
				{/each}
			</div>

			{#if isAnswered}
				<div class="mt-6 flex items-center justify-between">
					<div>
						{#if selectedAnswer === currentQuestion.correctIndex}
							<span class="font-semibold text-green-400">{t(locale, 'quiz.correct')}</span>
						{:else}
							<span class="font-semibold text-red-400">{t(locale, 'quiz.wrong')}</span>
						{/if}
						<span class="ml-3 text-sm text-text-secondary">
							<a
								href={getArticleUrl(currentQuestion.article)}
								class="underline hover:text-accent"
							>
								{t(locale, 'quiz.seeArticle')}
							</a>
						</span>
					</div>
					<button
						onclick={nextQuestion}
						class="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
					>
						{t(locale, 'quiz.next')}
					</button>
				</div>
			{/if}
		</div>
	</div>

{:else if phase === 'finished'}
	<div class="rounded-xl border border-border bg-bg-elevated p-8 text-center">
		<h2 class="mb-2 text-2xl font-bold text-text">{t(locale, 'quiz.finished')}</h2>

		<div class="my-6">
			<div class="text-5xl font-bold text-accent">
				{Math.round((score / questions.length) * 100)}%
			</div>
			<p class="mt-2 text-lg text-text-secondary">
				{t(locale, 'quiz.score', { score, total: questions.length })}
			</p>
		</div>

		{#if score === highScore && score > 0}
			<p class="mb-4 text-sm font-medium text-accent">
				{t(locale, 'quiz.highscore')}!
			</p>
		{/if}

		<button
			onclick={retry}
			class="rounded-lg bg-accent px-8 py-3 text-lg font-semibold text-white transition-transform hover:scale-105"
		>
			{t(locale, 'quiz.retry')}
		</button>
	</div>
{/if}
