import type { Category, CategorySlug } from '$lib/types/lore';

export const categories: Category[] = [
	{
		slug: 'cosmologie',
		name: 'Cosmologie',
		icon: '✦',
		description:
			"L'Aurbis, Aetherius, Oblivion, Mundus, et les théories métaphysiques (CHIM, Amaranth, Mantling, Énantiomorphe).",
		color: '#e8d48b'
	},
	{
		slug: 'daedra',
		name: 'Daedra',
		icon: '◈',
		description:
			'Les 16 Princes Daedriques, leurs royaumes, artefacts, cultes et invasions.',
		color: '#9b2335'
	},
	{
		slug: 'aedra',
		name: 'Aedra & Divins',
		icon: '☉',
		description:
			'Les Huit Divins (et le Neuvième), Lorkhan/Shezarr/Shor, le Thalmor et la question de Talos.',
		color: '#f0c75e'
	},
	{
		slug: 'races',
		name: 'Races & Peuples',
		icon: '⚔',
		description:
			'Les 10 races jouables, Dwemer, Falmer, Maormer, Sload, Hist, et autres peuples disparus.',
		color: '#6b8e5e'
	},
	{
		slug: 'empires',
		name: 'Empires & Factions',
		icon: '⚜',
		description:
			'Empire Alessien, Empire Reman, Empire Septim, Empire Mede, Thalmor, Lames, Greybeards, Psijiques.',
		color: '#8b4513'
	},
	{
		slug: 'geographie',
		name: 'Géographie',
		icon: '⊕',
		description:
			'Chaque province de Tamriel, Akavir, Atmora, Yokuda, Pyandonée — villes, régions, landmarks.',
		color: '#4a7c59'
	},
	{
		slug: 'magie',
		name: 'Magie',
		icon: '❋',
		description:
			"Écoles de magie, Psijiques, Architecture Tonale, Thu'um, CHIM, Tours et Pierres.",
		color: '#6a5acd'
	},
	{
		slug: 'artefacts',
		name: 'Artefacts',
		icon: '◆',
		description:
			'Artefacts daedriques, Numidium, Bâton du Chaos, Parchemins des Anciens, Cœur de Lorkhan.',
		color: '#b8860b'
	},
	{
		slug: 'personnages',
		name: 'Personnages clés',
		icon: '♚',
		description:
			'Vivec, Nerevar, Tiber Septim, Mannimarco, Sotha Sil, Dagoth Ur, Martin Septim, Alduin...',
		color: '#8b0000'
	},
	{
		slug: 'propheties',
		name: 'Prophéties & Textes',
		icon: '❡',
		description:
			'Les 36 Leçons de Vivec, Commentaires de Mankar Camoran, Livre du Destin, Chant du Dovahkiin.',
		color: '#4b0082'
	},
	{
		slug: 'lieux',
		name: 'Lieux',
		icon: '⌘',
		description:
			'Villes, régions, donjons et lieux emblématiques de Tamriel et au-delà.',
		color: '#2dd4bf'
	},
	{
		slug: 'guildes',
		name: 'Guildes & Ordres',
		icon: '⛊',
		description:
			'Guildes des Mages, des Guerriers, des Voleurs, Confrérie Noire, Compagnons, Dawnguard...',
		color: '#818cf8'
	},
	{
		slug: 'evenements',
		name: 'Événements',
		icon: '⚡',
		description:
			'Guerres, crises, batailles décisives et moments charnières de l\'histoire de Tamriel.',
		color: '#fb7185'
	},
	{
		slug: 'religion',
		name: 'Religion & Cultes',
		icon: '☽',
		description:
			'Cultes daedriques, Temple des Tribunaux, religion nordique, panthéons et hérésies.',
		color: '#c084fc'
	},
	{
		slug: 'politique',
		name: 'Politique',
		icon: '⚖',
		description:
			'Traités, alliances, diplomatie, conflits politiques et gouvernance des provinces.',
		color: '#fbbf24'
	}
];

export function getCategory(slug: CategorySlug): Category | undefined {
	return categories.find((c) => c.slug === slug);
}
