import type { PageLoad } from './$types';
import { getAllTags } from '$lib/utils/content-loader';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	return [{ lang: 'es' }];
}

export const load: PageLoad = ({ params }) => {
	const locale = params.lang as Locale;
	const tags = getAllTags(locale);
	return { tags, locale };
};
