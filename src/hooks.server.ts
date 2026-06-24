import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.params.lang ?? 'fr';

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('lang="fr"', `lang="${lang}"`)
	});
};
