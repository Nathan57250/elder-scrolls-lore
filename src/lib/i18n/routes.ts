import type { Locale } from './index';

const segments = {
	fr: { timeline: 'chronologie', categories: 'categories', search: 'recherche', tags: 'tags', graph: 'graphe' },
	en: { timeline: 'timeline', categories: 'categories', search: 'search', tags: 'tags', graph: 'graph' },
	es: { timeline: 'cronologia', categories: 'categorias', search: 'buscar', tags: 'etiquetas', graph: 'grafo' }
} as const;

export type RouteSegment = 'timeline' | 'categories' | 'search' | 'tags' | 'graph';

export function getSegment(locale: Locale, segment: RouteSegment): string {
	return segments[locale][segment];
}

export function localePath(locale: Locale, segment: RouteSegment, ...rest: string[]): string {
	const base = `/${locale}/${segments[locale][segment]}`;
	if (rest.length === 0) return base;
	return `${base}/${rest.join('/')}`;
}
