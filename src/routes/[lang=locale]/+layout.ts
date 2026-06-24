import type { LayoutLoad } from './$types';
import type { Locale } from '$lib/i18n';

export const prerender = true;

export const load: LayoutLoad = ({ params }) => {
	return {
		locale: params.lang as Locale
	};
};
