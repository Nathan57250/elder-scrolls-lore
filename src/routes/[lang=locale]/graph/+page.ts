import type { PageLoad } from './$types';
import type { Locale } from '$lib/i18n';

export const prerender = true;
export const ssr = false;

export function entries() {
	return [{ lang: 'en' }];
}

export const load: PageLoad = ({ params, url }) => {
	const locale = params.lang as Locale;
	const focus = url.searchParams.get('focus') ?? undefined;
	return { locale, focus };
};
