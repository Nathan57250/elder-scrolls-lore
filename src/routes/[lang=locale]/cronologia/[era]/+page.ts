import type { PageLoad } from './$types';
import { eras, getEra } from '$lib/data/eras';
import { getEntriesByEra } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';
import type { EraSlug } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	return eras.map((e) => ({ lang: 'es', era: e.slug }));
}

export const load: PageLoad = ({ params }) => {
	const locale = params.lang as Locale;
	const era = getEra(params.era as EraSlug);
	if (!era) {
		throw error(404, `Era "${params.era}" not found`);
	}

	const eraEntries = getEntriesByEra(locale, params.era as EraSlug);

	return { era, entries: eraEntries, locale };
};
