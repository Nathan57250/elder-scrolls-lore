export type EraSlug = 'dawn-era' | 'merethic-era' | 'first-era' | 'second-era' | 'third-era' | 'fourth-era';

export interface Era {
	slug: EraSlug;
	name: string;
	nameFr: string;
	startYear: number | null;
	endYear: number | null;
	color: string;
	description: string;
}

export interface LoreEntryFrontmatter {
	title: string;
	slug: string;
	era: EraSlug;
	category: CategorySlug;
	tags: string[];
	date?: string;
	timelineYear?: number;
	summary?: string;
	description?: string;
	mapCoords?: { x: number; y: number };
	province?: string;
	aliases?: string[];
	relatedArticles?: string[];
	sources?: string[];
}

export type CategorySlug =
	| 'cosmologie'
	| 'daedra'
	| 'aedra'
	| 'races'
	| 'empires'
	| 'geographie'
	| 'magie'
	| 'artefacts'
	| 'personnages'
	| 'propheties'
	| 'lieux'
	| 'guildes'
	| 'evenements'
	| 'religion'
	| 'politique';

export interface Category {
	slug: CategorySlug;
	name: string;
	icon: string;
	description: string;
	color: string;
}

export interface TimelineEvent {
	year: number;
	era: EraSlug;
	title: string;
	slug: string;
	summary: string;
	importance: 'major' | 'moderate' | 'minor';
}

export interface MapLocation {
	slug: string;
	name: string;
	province: string;
	coords: { x: number; y: number };
	summary: string;
	articleSlug?: string;
}

export interface SearchResult {
	title: string;
	slug: string;
	era: EraSlug;
	category: CategorySlug;
	summary: string;
	tags: string[];
	url: string;
}
