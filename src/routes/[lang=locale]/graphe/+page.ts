import type { PageLoad } from './$types';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	return [{ lang: 'fr' }];
}

export const load: PageLoad = ({ params, url }) => {
	const locale = params.lang as Locale;
	const focus = url.searchParams.get('focus') ?? undefined;
	return { locale, focus };
};
