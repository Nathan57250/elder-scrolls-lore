import type { Category, CategorySlug } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

export const categories: Category[] = [
	{
		slug: 'cosmologie',
		names: { fr: 'Cosmologie', en: 'Cosmology', es: 'Cosmología' },
		icon: '✦',
		descriptions: {
			fr: "L'Aurbis, Aetherius, Oblivion, Mundus, et les théories métaphysiques (CHIM, Amaranth, Mantling, Énantiomorphe).",
			en: 'The Aurbis, Aetherius, Oblivion, Mundus, and metaphysical theories (CHIM, Amaranth, Mantling, Enantiomorph).',
			es: 'El Aurbis, Aetherius, Oblivion, Mundus y las teorías metafísicas (CHIM, Amaranth, Mantling, Enantiomorfo).'
		},
		color: '#e8d48b'
	},
	{
		slug: 'daedra',
		names: { fr: 'Daedra', en: 'Daedra', es: 'Daedra' },
		icon: '◈',
		descriptions: {
			fr: 'Les 16 Princes Daedriques, leurs royaumes, artefacts, cultes et invasions.',
			en: 'The 16 Daedric Princes, their realms, artifacts, cults and invasions.',
			es: 'Los 16 Príncipes Daédricos, sus reinos, artefactos, cultos e invasiones.'
		},
		color: '#9b2335'
	},
	{
		slug: 'aedra',
		names: { fr: 'Aedra & Divins', en: 'Aedra & Divines', es: 'Aedra & Divinos' },
		icon: '☉',
		descriptions: {
			fr: 'Les Huit Divins (et le Neuvième), Lorkhan/Shezarr/Shor, le Thalmor et la question de Talos.',
			en: 'The Eight Divines (and the Ninth), Lorkhan/Shezarr/Shor, the Thalmor and the Talos question.',
			es: 'Los Ocho Divinos (y el Noveno), Lorkhan/Shezarr/Shor, el Thalmor y la cuestión de Talos.'
		},
		color: '#f0c75e'
	},
	{
		slug: 'races',
		names: { fr: 'Races & Peuples', en: 'Races & Peoples', es: 'Razas & Pueblos' },
		icon: '⚔',
		descriptions: {
			fr: 'Les 10 races jouables, Dwemer, Falmer, Maormer, Sload, Hist, et autres peuples disparus.',
			en: 'The 10 playable races, Dwemer, Falmer, Maormer, Sload, Hist, and other lost peoples.',
			es: 'Las 10 razas jugables, Dwemer, Falmer, Maormer, Sload, Hist y otros pueblos desaparecidos.'
		},
		color: '#6b8e5e'
	},
	{
		slug: 'empires',
		names: { fr: 'Empires & Factions', en: 'Empires & Factions', es: 'Imperios & Facciones' },
		icon: '⚜',
		descriptions: {
			fr: 'Empire Alessien, Empire Reman, Empire Septim, Empire Mede, Thalmor, Lames, Greybeards, Psijiques.',
			en: 'Alessian Empire, Reman Empire, Septim Empire, Mede Empire, Thalmor, Blades, Greybeards, Psijics.',
			es: 'Imperio Alessiano, Imperio Reman, Imperio Septim, Imperio Mede, Thalmor, Cuchillas, Barbas Grises, Psijicos.'
		},
		color: '#8b4513'
	},
	{
		slug: 'geographie',
		names: { fr: 'Géographie', en: 'Geography', es: 'Geografía' },
		icon: '⊕',
		descriptions: {
			fr: 'Chaque province de Tamriel, Akavir, Atmora, Yokuda, Pyandonée — villes, régions, landmarks.',
			en: 'Every province of Tamriel, Akavir, Atmora, Yokuda, Pyandonea — cities, regions, landmarks.',
			es: 'Cada provincia de Tamriel, Akavir, Atmora, Yokuda, Pyandonea — ciudades, regiones, hitos.'
		},
		color: '#4a7c59'
	},
	{
		slug: 'magie',
		names: { fr: 'Magie', en: 'Magic', es: 'Magia' },
		icon: '❋',
		descriptions: {
			fr: "Écoles de magie, Psijiques, Architecture Tonale, Thu'um, CHIM, Tours et Pierres.",
			en: "Schools of magic, Psijics, Tonal Architecture, Thu'um, CHIM, Towers and Stones.",
			es: "Escuelas de magia, Psijicos, Arquitectura Tonal, Thu'um, CHIM, Torres y Piedras."
		},
		color: '#6a5acd'
	},
	{
		slug: 'artefacts',
		names: { fr: 'Artefacts', en: 'Artifacts', es: 'Artefactos' },
		icon: '◆',
		descriptions: {
			fr: 'Artefacts daedriques, Numidium, Bâton du Chaos, Parchemins des Anciens, Cœur de Lorkhan.',
			en: "Daedric artifacts, Numidium, Staff of Chaos, Elder Scrolls, Heart of Lorkhan.",
			es: 'Artefactos daédricos, Numidium, Bastón del Caos, Pergaminos Antiguos, Corazón de Lorkhan.'
		},
		color: '#b8860b'
	},
	{
		slug: 'personnages',
		names: { fr: 'Personnages clés', en: 'Key Characters', es: 'Personajes clave' },
		icon: '♚',
		descriptions: {
			fr: 'Vivec, Nerevar, Tiber Septim, Mannimarco, Sotha Sil, Dagoth Ur, Martin Septim, Alduin...',
			en: 'Vivec, Nerevar, Tiber Septim, Mannimarco, Sotha Sil, Dagoth Ur, Martin Septim, Alduin...',
			es: 'Vivec, Nerevar, Tiber Septim, Mannimarco, Sotha Sil, Dagoth Ur, Martin Septim, Alduin...'
		},
		color: '#8b0000'
	},
	{
		slug: 'propheties',
		names: { fr: 'Prophéties & Textes', en: 'Prophecies & Texts', es: 'Profecías & Textos' },
		icon: '❡',
		descriptions: {
			fr: 'Les 36 Leçons de Vivec, Commentaires de Mankar Camoran, Livre du Destin, Chant du Dovahkiin.',
			en: "The 36 Lessons of Vivec, Mankar Camoran's Commentaries, Book of Fate, Song of the Dovahkiin.",
			es: 'Las 36 Lecciones de Vivec, Comentarios de Mankar Camoran, Libro del Destino, Canto del Dovahkiin.'
		},
		color: '#4b0082'
	},
	{
		slug: 'lieux',
		names: { fr: 'Lieux', en: 'Locations', es: 'Lugares' },
		icon: '⌘',
		descriptions: {
			fr: 'Villes, régions, donjons et lieux emblématiques de Tamriel et au-delà.',
			en: 'Cities, regions, dungeons and iconic locations of Tamriel and beyond.',
			es: 'Ciudades, regiones, mazmorras y lugares emblemáticos de Tamriel y más allá.'
		},
		color: '#2dd4bf'
	},
	{
		slug: 'guildes',
		names: { fr: 'Guildes & Ordres', en: 'Guilds & Orders', es: 'Gremios & Órdenes' },
		icon: '⛊',
		descriptions: {
			fr: 'Guildes des Mages, des Guerriers, des Voleurs, Confrérie Noire, Compagnons, Dawnguard...',
			en: "Mages Guild, Fighters Guild, Thieves Guild, Dark Brotherhood, Companions, Dawnguard...",
			es: 'Gremio de Magos, Gremio de Guerreros, Gremio de Ladrones, Hermandad Oscura, Compañeros, Guardia del Alba...'
		},
		color: '#818cf8'
	},
	{
		slug: 'evenements',
		names: { fr: 'Événements', en: 'Events', es: 'Eventos' },
		icon: '⚡',
		descriptions: {
			fr: "Guerres, crises, batailles décisives et moments charnières de l'histoire de Tamriel.",
			en: 'Wars, crises, decisive battles and turning points in the history of Tamriel.',
			es: 'Guerras, crisis, batallas decisivas y momentos cruciales en la historia de Tamriel.'
		},
		color: '#fb7185'
	},
	{
		slug: 'religion',
		names: { fr: 'Religion & Cultes', en: 'Religion & Cults', es: 'Religión & Cultos' },
		icon: '☽',
		descriptions: {
			fr: 'Cultes daedriques, Temple des Tribunaux, religion nordique, panthéons et hérésies.',
			en: 'Daedric cults, Tribunal Temple, Nordic religion, pantheons and heresies.',
			es: 'Cultos daédricos, Templo del Tribunal, religión nórdica, panteones y herejías.'
		},
		color: '#c084fc'
	},
	{
		slug: 'politique',
		names: { fr: 'Politique', en: 'Politics', es: 'Política' },
		icon: '⚖',
		descriptions: {
			fr: 'Traités, alliances, diplomatie, conflits politiques et gouvernance des provinces.',
			en: 'Treaties, alliances, diplomacy, political conflicts and provincial governance.',
			es: 'Tratados, alianzas, diplomacia, conflictos políticos y gobernanza de las provincias.'
		},
		color: '#fbbf24'
	}
];

export function getCategory(slug: CategorySlug): Category | undefined {
	return categories.find((c) => c.slug === slug);
}

export function getCategoryName(category: Category, locale: Locale): string {
	return category.names[locale];
}

export function getCategoryDescription(category: Category, locale: Locale): string {
	return category.descriptions[locale];
}
