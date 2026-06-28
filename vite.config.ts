import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) => {
					if (filename.split(/[/\\]/).includes('node_modules')) return undefined;
					if (filename.endsWith('.svx')) return undefined;
					return true;
				}
			},
			extensions: ['.svelte', '.svx'],
			preprocess: [
				mdsvex({
					extensions: ['.svx'],
					layout: {
						_: resolve(__dirname, './src/lib/components/LoreEntry.svelte')
					}
				})
			],
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: undefined,
				precompress: true
			}),
			prerender: {
				entries: ['*'],
				handleHttpError: ({ path, referrer, message }) => {
					if (path.startsWith('/images/')) {
						console.warn(`Missing image: ${path}`);
						return;
					}
					if (path.startsWith('/chronologie/') || path.startsWith('/categories/') || path.startsWith('/recherche')) {
						console.warn(`Legacy path (needs locale prefix): ${path}`);
						return;
					}
					if (path.match(/^\/(en|es)\//)) {
						console.warn(`Missing locale content: ${path}`);
						return;
					}
					throw new Error(message);
				},
				handleUnseenRoutes: 'ignore'
			}
		})
	]
});
