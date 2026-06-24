import type { PageLoad } from './$types';
import { getEntryByEraAndSlug, getAllEntries } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';
import type { EraSlug } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	return getAllEntries('es').map((e) => ({ lang: 'es', era: e.era, entry: e.slug }));
}

export const load: PageLoad = ({ params }) => {
	const locale = params.lang as Locale;
	const result = getEntryByEraAndSlug(locale, params.era as EraSlug, params.entry);

	if (!result) {
		throw error(404, `Article "${params.entry}" not found`);
	}

	return {
		metadata: result.metadata,
		component: result.component,
		locale
	};
};
