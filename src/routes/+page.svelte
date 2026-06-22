<script lang="ts">
	import Timeline from '$lib/components/Timeline.svelte';
	import { eras } from '$lib/data/eras';
</script>

<svelte:head>
	<title>Grand Livre du Lore — Encyclopédie Elder Scrolls</title>
</svelte:head>

<div class="px-4 py-12">
	<!-- Hero -->
	<section class="mx-auto mb-16 max-w-3xl text-center">
		<h1 class="text-4xl font-bold tracking-tight text-text md:text-5xl">
			Le Grand Livre du Lore
		</h1>
		<p class="mt-4 text-lg text-text-secondary">
			Encyclopédie chronologique de l'univers <em class="text-text">The Elder Scrolls</em> —
			de la Création de l'Aurbis au retour d'Alduin.
		</p>
	</section>

	<!-- Era overview cards -->
	<section class="mx-auto mb-16 max-w-5xl">
		<h2 class="mb-6 text-center text-xl font-semibold text-text">
			Les Ères de Tamriel
		</h2>
		<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each eras as era}
				<a
					href="/chronologie/{era.slug}"
					class="group rounded-lg border border-border bg-surface p-5 transition-all hover:border-border-subtle hover:bg-surface-hover"
				>
					<div class="mb-2 flex items-center gap-2">
						<span
							class="h-2.5 w-2.5 rounded-full"
							style="background-color: {era.color}"
						></span>
						<h3 class="text-sm font-semibold text-text group-hover:text-accent">
							{era.nameFr}
						</h3>
					</div>
					<p class="text-sm text-text-secondary">
						{era.description}
					</p>
				</a>
			{/each}
		</div>
	</section>

	<!-- Timeline -->
	<section>
		<h2 class="mb-6 text-center text-xl font-semibold text-text">
			Frise Chronologique
		</h2>
		<Timeline />
	</section>
</div>
