import type { PageLoad } from './$types';
import { locales } from '$lib/i18n';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export function entries() {
	return locales.map((lang) => ({ lang }));
}

export const load: PageLoad = ({ params }) => {
	return {
		locale: params.lang as Locale
	};
};
