<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import QuizGame from '$lib/components/QuizGame.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{t(locale, 'quiz.title')} — {t(locale, 'site.title')}</title>
	<meta name="description" content={t(locale, 'quiz.title')} />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold tracking-tight text-text">
		{t(locale, 'quiz.title')}
	</h1>
	<QuizGame {locale} />
</div>
