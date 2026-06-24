import type { PageLoad } from './$types';
import { getEntryBySlug, getAllEntries } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	const frEntries = getAllEntries('fr').map((e) => ({ lang: 'fr', category: e.category, slug: e.slug }));
	const enEntries = getAllEntries('en').map((e) => ({ lang: 'en', category: e.category, slug: e.slug }));
	return [...frEntries, ...enEntries];
}

export const load: PageLoad = ({ params }) => {
	const locale = params.lang as Locale;
	const result = getEntryBySlug(locale, params.slug);

	if (!result) {
		throw error(404, `Article "${params.slug}" not found`);
	}

	return {
		metadata: result.metadata,
		component: result.component,
		locale
	};
};
