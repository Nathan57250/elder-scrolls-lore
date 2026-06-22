import type { PageLoad } from './$types';
import { getEntryByEraAndSlug } from '$lib/utils/content-loader';
import { error } from '@sveltejs/kit';
import type { EraSlug } from '$lib/types/lore';

export const prerender = true;

export const load: PageLoad = ({ params }) => {
	const result = getEntryByEraAndSlug(params.era as EraSlug, params.entry);

	if (!result) {
		throw error(404, `Article "${params.entry}" non trouvé dans l'ère "${params.era}"`);
	}

	return {
		metadata: result.metadata,
		component: result.component
	};
};
