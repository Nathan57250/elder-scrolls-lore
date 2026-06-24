import type { PageLoad } from './$types';
import { categories, getCategory } from '$lib/data/categories';
import { getEntriesByCategory } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';
import type { CategorySlug } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	const langs = ['fr', 'en'];
	return langs.flatMap((lang) => categories.map((c) => ({ lang, category: c.slug })));
}

export const load: PageLoad = ({ params }) => {
	const locale = params.lang as Locale;
	const category = getCategory(params.category as CategorySlug);
	if (!category) {
		throw error(404, `Category "${params.category}" not found`);
	}

	const categoryEntries = getEntriesByCategory(locale, params.category as CategorySlug);

	return { category, entries: categoryEntries, locale };
};
