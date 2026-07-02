import type { PageLoad } from './$types';
import type { Locale } from '$lib/i18n';

export const prerender = true;
export const ssr = false;

export function entries() {
	return [{ lang: 'en' }];
}

export const load: PageLoad = ({ params, url }) => {
	const locale = params.lang as Locale;
	const left = url.searchParams.get('left') ?? undefined;
	const right = url.searchParams.get('right') ?? undefined;
	return { locale, left, right };
};
