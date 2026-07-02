import type { PageLoad } from './$types';
import { getAllTags, getEntriesByTag } from '$lib/utils/content-loader';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	return getAllTags('es').map(({ tag }) => ({ lang: 'es', tag: encodeURIComponent(tag) }));
}

export const load: PageLoad = ({ params }) => {
	const locale = params.lang as Locale;
	const tag = decodeURIComponent(params.tag);
	const tagEntries = getEntriesByTag(locale, tag);

	return { tag, entries: tagEntries, locale };
};
