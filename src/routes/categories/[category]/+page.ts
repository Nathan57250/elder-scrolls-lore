import type { PageLoad } from './$types';
import { categories } from '$lib/data/categories';
import { getEntriesByCategory } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';
import type { CategorySlug } from '$lib/types/lore';

export const prerender = true;

export const load: PageLoad = ({ params }) => {
	const category = categories.find((c) => c.slug === params.category);
	if (!category) {
		throw error(404, `Catégorie "${params.category}" non trouvée`);
	}

	const entries = getEntriesByCategory(params.category as CategorySlug);

	return { category, entries };
};
