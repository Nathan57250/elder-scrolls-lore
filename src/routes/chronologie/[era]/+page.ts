import type { PageLoad } from './$types';
import { eras } from '$lib/data/eras';
import { getEntriesByEra } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';
import type { EraSlug } from '$lib/types/lore';

export const prerender = true;

export function entries() {
	return eras.map((e) => ({ era: e.slug }));
}

export const load: PageLoad = ({ params }) => {
	const era = eras.find((e) => e.slug === params.era);
	if (!era) {
		throw error(404, `Ère "${params.era}" non trouvée`);
	}

	const entries = getEntriesByEra(params.era as EraSlug);

	return { era, entries };
};
