import type { PageLoad } from './$types';
import type { Locale } from '$lib/i18n';

export const prerender = true;
export const ssr = false;

export function entries() {
	return [{ lang: 'es' }];
}

export const load: PageLoad = ({ params }) => {
	const locale = params.lang as Locale;
	return { locale };
};
