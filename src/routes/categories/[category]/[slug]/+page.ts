import type { PageLoad } from './$types';
import { getEntryBySlug, getAllEntries } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';

export const prerender = true;

export function entries() {
	return getAllEntries().map((e) => ({ category: e.category, slug: e.slug }));
}

export const load: PageLoad = ({ params }) => {
	const result = getEntryBySlug(params.slug);

	if (!result) {
		throw error(404, `Article "${params.slug}" non trouvé`);
	}

	return {
		metadata: result.metadata,
		component: result.component
	};
};
