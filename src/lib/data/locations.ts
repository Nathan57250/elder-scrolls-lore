import type { MapLocation } from '$lib/types/lore';

export const locations: MapLocation[] = [
	{
		slug: 'cite-imperiale',
		name: 'Cité Impériale',
		province: 'Cyrodiil',
		coords: { x: 512, y: 480 },
		summary:
			"Capitale de l'Empire de Tamriel, située sur l'Île de la Cité au centre du lac Rumare. Siège de la Tour d'Or Blanc.",
		articleSlug: 'cite-imperiale'
	},
	{
		slug: 'vivec-city',
		name: 'Vivec',
		province: 'Morrowind',
		coords: { x: 720, y: 320 },
		summary:
			'Cité sainte du Tribunal construite sur les eaux de la Baie Intérieure, composée de cantons flottants massifs.',
		articleSlug: 'vivec-city'
	},
	{
		slug: 'blancherive',
		name: 'Blancherive',
		province: 'Bordeciel',
		coords: { x: 430, y: 220 },
		summary:
			"Ville centrale de Bordeciel, dominée par Fort-Dragon. C'est ici que le Dovahkiin apprend sa nature.",
		articleSlug: 'blancherive'
	},
	{
		slug: 'solitude',
		name: 'Solitude',
		province: 'Bordeciel',
		coords: { x: 370, y: 170 },
		summary:
			"Capitale de Bordeciel et siège du Haut-Roi, bâtie sur un arc naturel de pierre au-dessus de la mer.",
		articleSlug: 'solitude'
	},
	{
		slug: 'vendhelm',
		name: 'Vendhelm',
		province: 'Bordeciel',
		coords: { x: 520, y: 190 },
		summary:
			'Capitale des Sombrages et plus ancienne ville de Bordeciel, fondée par Ysgramor lui-même.',
		articleSlug: 'vendhelm'
	},
	{
		slug: 'morrowind-vvardenfell',
		name: 'Vvardenfell',
		province: 'Morrowind',
		coords: { x: 740, y: 300 },
		summary:
			"Île volcanique dominée par le Mont Écarlate, abritant les ruines du Cœur de Lorkhan et l'ancienne cité Dwemer d'Arkngthand.",
		articleSlug: 'vvardenfell'
	},
	{
		slug: 'alinor',
		name: 'Alinor',
		province: 'Archipel de lEstival',
		coords: { x: 180, y: 580 },
		summary:
			"Capitale de l'Archipel de l'Estival (Îles Summerset) et quartier général du Thalmor et du Domaine Aldmeri.",
		articleSlug: 'alinor'
	},
	{
		slug: 'daguefilante',
		name: 'Daguefilante',
		province: 'Hauteroche',
		coords: { x: 320, y: 280 },
		summary:
			"Puissante cité-État de Hauteroche, une des plus importantes du nord-ouest de Tamriel.",
		articleSlug: 'daguefilante'
	},
	{
		slug: 'elsweyr-torval',
		name: 'Torval',
		province: 'Elsweyr',
		coords: { x: 440, y: 620 },
		summary:
			'Ancienne capitale religieuse des Khajiits, abritant la Crinière — le chef spirituel de leur peuple.',
		articleSlug: 'torval'
	},
	{
		slug: 'marais-noir-lilmoth',
		name: 'Lilmoth',
		province: 'Marais Noir',
		coords: { x: 660, y: 560 },
		summary:
			'Port du Marais Noir, où les Argoniens vivent en harmonie avec les Hist dans les marécages.',
		articleSlug: 'lilmoth'
	},
	{
		slug: 'orsinium',
		name: 'Orsinium',
		province: 'Hauteroche',
		coords: { x: 350, y: 320 },
		summary:
			"Cité orque reconstruite à maintes reprises, symbole de la persévérance du peuple orsimer.",
		articleSlug: 'orsinium'
	},
	{
		slug: 'mont-ecarlate',
		name: 'Mont Écarlate',
		province: 'Morrowind',
		coords: { x: 735, y: 285 },
		summary:
			'Volcan massif au centre de Vvardenfell, contenant la Citadelle de Dagoth Ur et le Cœur de Lorkhan.',
		articleSlug: 'mont-ecarlate'
	},
	{
		slug: 'tour-or-blanc',
		name: "Tour d'Or Blanc",
		province: 'Cyrodiil',
		coords: { x: 514, y: 478 },
		summary:
			"Tour Ada-Mantia de la Cité Impériale, construite par les Ayléides. Pierre angulaire métaphysique de Tamriel.",
		articleSlug: 'tour-or-blanc'
	},
	{
		slug: 'labyrinthian',
		name: 'Labyrinthian',
		province: 'Bordeciel',
		coords: { x: 410, y: 200 },
		summary:
			'Ancienne cité nordique de Bromjunaar, autrefois capitale du culte des Dragons.',
		articleSlug: 'labyrinthian'
	},
	{
		slug: 'havreglace',
		name: 'Havreglace',
		province: 'Bordeciel',
		coords: { x: 460, y: 160 },
		summary:
			"Ville nordique et siège du Collège de Fortdhiver, la plus importante institution d'étude de la magie en Bordeciel."
	},
	{
		slug: 'skingrad',
		name: 'Skingrad',
		province: 'Cyrodiil',
		coords: { x: 460, y: 500 },
		summary:
			'Comté de Cyrodiil réputé pour ses vignobles et son comte-vampire, Janus Hassildor.'
	},
	{
		slug: 'kvatch',
		name: 'Kvatch',
		province: 'Cyrodiil',
		coords: { x: 430, y: 510 },
		summary:
			"Première ville détruite lors de la Crise d'Oblivion par la Porte de Mehrunes Dagon."
	},
	{
		slug: 'balmora',
		name: 'Balmora',
		province: 'Morrowind',
		coords: { x: 710, y: 310 },
		summary:
			"Ville dunmer de style impérial sur Vvardenfell, siège de la Guilde des Guerriers et des Mages locales."
	},
	{
		slug: 'blackreach',
		name: 'Griffenoire',
		province: 'Bordeciel',
		coords: { x: 450, y: 210 },
		summary:
			"Immense caverne souterraine Dwemer s'étendant sous une grande partie de Bordeciel, illuminée par des champignons géants."
	},
	{
		slug: 'sovngarde',
		name: 'Sovngarde',
		province: 'Aetherius',
		coords: { x: 450, y: 100 },
		summary:
			"Le hall des héros nordiques morts au combat, dominé par le Hall de Shor. Lieu du combat final contre Alduin."
	}
];

export function getLocation(slug: string): MapLocation | undefined {
	return locations.find((l) => l.slug === slug);
}

export function getLocationsByProvince(province: string): MapLocation[] {
	return locations.filter((l) => l.province === province);
}
