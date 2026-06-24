import type { MapLocation } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

export const locations: MapLocation[] = [
	{
		slug: 'cite-imperiale',
		names: { fr: 'Cité Impériale', en: 'Imperial City', es: 'Ciudad Imperial' },
		province: 'Cyrodiil',
		coords: { x: 512, y: 480 },
		summary: "Capitale de l'Empire de Tamriel, située sur l'Île de la Cité au centre du lac Rumare.",
		articleSlug: 'cite-imperiale'
	},
	{
		slug: 'vivec-city',
		names: { fr: 'Vivec', en: 'Vivec City', es: 'Ciudad Vivec' },
		province: 'Morrowind',
		coords: { x: 720, y: 320 },
		summary: 'Cité sainte du Tribunal construite sur les eaux de la Baie Intérieure.',
		articleSlug: 'vivec-city'
	},
	{
		slug: 'blancherive',
		names: { fr: 'Blancherive', en: 'Whiterun', es: 'Carrera Blanca' },
		province: 'Bordeciel',
		coords: { x: 430, y: 220 },
		summary: "Ville centrale de Bordeciel, dominée par Fort-Dragon.",
		articleSlug: 'blancherive'
	},
	{
		slug: 'solitude',
		names: { fr: 'Solitude', en: 'Solitude', es: 'Soledad' },
		province: 'Bordeciel',
		coords: { x: 370, y: 170 },
		summary: "Capitale de Bordeciel et siège du Haut-Roi.",
		articleSlug: 'solitude'
	},
	{
		slug: 'vendhelm',
		names: { fr: 'Vendhelm', en: 'Windhelm', es: 'Ventohelm' },
		province: 'Bordeciel',
		coords: { x: 520, y: 190 },
		summary: 'Capitale des Sombrages et plus ancienne ville de Bordeciel.',
		articleSlug: 'vendhelm'
	},
	{
		slug: 'morrowind-vvardenfell',
		names: { fr: 'Vvardenfell', en: 'Vvardenfell', es: 'Vvardenfell' },
		province: 'Morrowind',
		coords: { x: 740, y: 300 },
		summary: "Île volcanique dominée par le Mont Écarlate.",
		articleSlug: 'vvardenfell'
	},
	{
		slug: 'alinor',
		names: { fr: 'Alinor', en: 'Alinor', es: 'Alinor' },
		province: 'Archipel de lEstival',
		coords: { x: 180, y: 580 },
		summary: "Capitale de l'Archipel de l'Estival et quartier général du Thalmor.",
		articleSlug: 'alinor'
	},
	{
		slug: 'daguefilante',
		names: { fr: 'Daguefilante', en: 'Daggerfall', es: 'Daggerfall' },
		province: 'Hauteroche',
		coords: { x: 320, y: 280 },
		summary: "Puissante cité-État de Hauteroche.",
		articleSlug: 'daguefilante'
	},
	{
		slug: 'elsweyr-torval',
		names: { fr: 'Torval', en: 'Torval', es: 'Torval' },
		province: 'Elsweyr',
		coords: { x: 440, y: 620 },
		summary: 'Ancienne capitale religieuse des Khajiits.',
		articleSlug: 'torval'
	},
	{
		slug: 'marais-noir-lilmoth',
		names: { fr: 'Lilmoth', en: 'Lilmoth', es: 'Lilmoth' },
		province: 'Marais Noir',
		coords: { x: 660, y: 560 },
		summary: 'Port du Marais Noir, où les Argoniens vivent en harmonie avec les Hist.',
		articleSlug: 'lilmoth'
	},
	{
		slug: 'orsinium',
		names: { fr: 'Orsinium', en: 'Orsinium', es: 'Orsinium' },
		province: 'Hauteroche',
		coords: { x: 350, y: 320 },
		summary: "Cité orque reconstruite à maintes reprises.",
		articleSlug: 'orsinium'
	},
	{
		slug: 'mont-ecarlate',
		names: { fr: 'Mont Écarlate', en: 'Red Mountain', es: 'Montaña Roja' },
		province: 'Morrowind',
		coords: { x: 735, y: 285 },
		summary: 'Volcan massif au centre de Vvardenfell.',
		articleSlug: 'mont-ecarlate'
	},
	{
		slug: 'tour-or-blanc',
		names: { fr: "Tour d'Or Blanc", en: 'White-Gold Tower', es: 'Torre de Oro Blanco' },
		province: 'Cyrodiil',
		coords: { x: 514, y: 478 },
		summary: "Tour Ada-Mantia de la Cité Impériale.",
		articleSlug: 'tour-or-blanc'
	},
	{
		slug: 'labyrinthian',
		names: { fr: 'Labyrinthian', en: 'Labyrinthian', es: 'Labyrinthian' },
		province: 'Bordeciel',
		coords: { x: 410, y: 200 },
		summary: 'Ancienne cité nordique de Bromjunaar.',
		articleSlug: 'labyrinthian'
	},
	{
		slug: 'havreglace',
		names: { fr: 'Havreglace', en: 'Winterhold', es: 'Hibernalia' },
		province: 'Bordeciel',
		coords: { x: 460, y: 160 },
		summary: "Ville nordique et siège du Collège de Fortdhiver."
	},
	{
		slug: 'skingrad',
		names: { fr: 'Skingrad', en: 'Skingrad', es: 'Skingrad' },
		province: 'Cyrodiil',
		coords: { x: 460, y: 500 },
		summary: 'Comté de Cyrodiil réputé pour ses vignobles.'
	},
	{
		slug: 'kvatch',
		names: { fr: 'Kvatch', en: 'Kvatch', es: 'Kvatch' },
		province: 'Cyrodiil',
		coords: { x: 430, y: 510 },
		summary: "Première ville détruite lors de la Crise d'Oblivion."
	},
	{
		slug: 'balmora',
		names: { fr: 'Balmora', en: 'Balmora', es: 'Balmora' },
		province: 'Morrowind',
		coords: { x: 710, y: 310 },
		summary: "Ville dunmer de style impérial sur Vvardenfell."
	},
	{
		slug: 'blackreach',
		names: { fr: 'Griffenoire', en: 'Blackreach', es: 'Alcanegro' },
		province: 'Bordeciel',
		coords: { x: 450, y: 210 },
		summary: "Immense caverne souterraine Dwemer sous Bordeciel."
	},
	{
		slug: 'sovngarde',
		names: { fr: 'Sovngarde', en: 'Sovngarde', es: 'Sovngarde' },
		province: 'Aetherius',
		coords: { x: 450, y: 100 },
		summary: "Le hall des héros nordiques morts au combat."
	}
];

export function getLocation(slug: string): MapLocation | undefined {
	return locations.find((l) => l.slug === slug);
}

export function getLocationsByProvince(province: string): MapLocation[] {
	return locations.filter((l) => l.province === province);
}

export function getLocationName(location: MapLocation, locale: Locale): string {
	return location.names[locale];
}
