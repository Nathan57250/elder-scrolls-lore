<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		const supported = ['fr', 'en', 'es'];
		const saved = localStorage.getItem('preferred-locale');
		if (saved && supported.includes(saved)) {
			goto(`/${saved}`, { replaceState: true });
			return;
		}
		const browserLang = (navigator.language || 'fr').split('-')[0];
		const locale = supported.includes(browserLang) ? browserLang : 'fr';
		goto(`/${locale}`, { replaceState: true });
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="animate-pulse text-text-muted">...</div>
</div>
