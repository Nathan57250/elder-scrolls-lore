import type { Locale } from './index';

const segments = {
	fr: { timeline: 'chronologie', categories: 'categories', search: 'recherche', tags: 'tags', graph: 'graphe', quiz: 'quiz', 'timeline-view': 'frise', map: 'carte', compare: 'comparer', lineages: 'lignees', paths: 'parcours', stats: 'statistiques' },
	en: { timeline: 'timeline', categories: 'categories', search: 'search', tags: 'tags', graph: 'graph', quiz: 'quiz', 'timeline-view': 'timeline-view', map: 'map', compare: 'compare', lineages: 'lineages', paths: 'paths', stats: 'stats' },
	es: { timeline: 'cronologia', categories: 'categorias', search: 'buscar', tags: 'etiquetas', graph: 'grafo', quiz: 'quiz', 'timeline-view': 'linea-temporal', map: 'mapa', compare: 'comparar', lineages: 'linajes', paths: 'recorridos', stats: 'estadisticas' }
} as const;

export type RouteSegment = 'timeline' | 'categories' | 'search' | 'tags' | 'graph' | 'quiz' | 'timeline-view' | 'map' | 'compare' | 'lineages' | 'paths' | 'stats';

export function getSegment(locale: Locale, segment: RouteSegment): string {
	return segments[locale][segment];
}

export function localePath(locale: Locale, segment: RouteSegment, ...rest: string[]): string {
	const base = `/${locale}/${segments[locale][segment]}`;
	if (rest.length === 0) return base;
	return `${base}/${rest.join('/')}`;
}
