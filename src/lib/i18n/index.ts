export type Locale = 'fr' | 'en' | 'es';

export const locales: Locale[] = ['fr', 'en', 'es'];
export const defaultLocale: Locale = 'fr';

import fr from './fr';
import en from './en';
import es from './es';

const translations: Record<Locale, Record<string, string>> = { fr, en, es };

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
	let str = translations[locale][key] ?? translations[defaultLocale][key] ?? key;

	if (params) {
		for (const [k, v] of Object.entries(params)) {
			str = str.replaceAll(`{${k}}`, String(v));
			const plural = Number(v) !== 1 ? 's' : '';
			str = str.replaceAll(`{${k}:s}`, plural);
		}
	}

	return str;
}
