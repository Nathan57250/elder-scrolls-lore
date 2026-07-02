import type { PageLoad } from './$types';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	return [{ lang: 'en' }];
}

export const load: PageLoad = ({ params }) => {
	return { locale: params.lang as Locale };
};
