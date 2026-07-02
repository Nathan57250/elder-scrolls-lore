import type { Locale } from '$lib/i18n';

export interface NarrativePath {
	id: string;
	names: Record<Locale, string>;
	descriptions: Record<Locale, string>;
	icon: string;
	color: string;
	articles: string[]; // ordered list of slugs
}

export const narrativePaths: NarrativePath[] = [
	{
		id: 'creation-cosmology',
		names: {
			fr: 'Création & Cosmologie',
			en: 'Creation & Cosmology',
			es: 'Creacion & Cosmologia'
		},
		descriptions: {
			fr: "Des origines de l'Aurbis à la création de Mundus — explorez les fondations métaphysiques de l'univers.",
			en: 'From the origins of the Aurbis to the creation of Mundus — explore the metaphysical foundations of the universe.',
			es: 'Desde los origenes del Aurbis hasta la creacion de Mundus — explora los fundamentos metafisicos del universo.'
		},
		icon: '🌌',
		color: '#9b59b6',
		articles: [
			'aurbis',
			'anuiel',
			'sithis',
			'les-divins',
			'lorkhan',
			'convention',
			'mundus',
			'aetherius',
			'magnus',
			'nirn',
			'ehlnofey'
		]
	},
	{
		id: 'great-war',
		names: {
			fr: 'La Grande Guerre',
			en: 'The Great War',
			es: 'La Gran Guerra'
		},
		descriptions: {
			fr: "L'ascension du Thalmor, la Grande Guerre et le Concordat de l'Or Blanc qui changea Tamriel à jamais.",
			en: "The rise of the Thalmor, the Great War, and the White-Gold Concordat that changed Tamriel forever.",
			es: 'El ascenso del Thalmor, la Gran Guerra y el Concordato del Oro Blanco que cambio Tamriel para siempre.'
		},
		icon: '⚔️',
		color: '#e74c3c',
		articles: [
			'montee-du-thalmor',
			'second-domaine-aldmeri',
			'thalmor',
			'grande-guerre',
			'concordat-or-blanc',
			'thalmor-justiciars',
			'incident-markarth',
			'ulfric-sombrage',
			'guerre-civile-bordeciel'
		]
	},
	{
		id: 'rise-fall-septims',
		names: {
			fr: 'Grandeur et Déclin des Septim',
			en: 'Rise and Fall of the Septims',
			es: 'Auge y Caida de los Septim'
		},
		descriptions: {
			fr: "De Tiber Septim à Martin Septim — la dynastie qui forgea l'Empire et sa fin tragique.",
			en: 'From Tiber Septim to Martin Septim — the dynasty that forged the Empire and its tragic end.',
			es: 'Desde Tiber Septim hasta Martin Septim — la dinastia que forjo el Imperio y su tragico final.'
		},
		icon: '👑',
		color: '#c9a227',
		articles: [
			'tiber-septim',
			'talos',
			'empire-septim',
			'amulette-des-rois',
			'uriel-septim-vii',
			'simulacrum-imperial',
			'crise-oblivion',
			'mythic-dawn',
			'martin-septim'
		]
	},
	{
		id: 'tribunal',
		names: {
			fr: 'Le Tribunal',
			en: 'The Tribunal',
			es: 'El Tribunal'
		},
		descriptions: {
			fr: "L'histoire de Morrowind à travers ses dieux vivants — Vivec, Almalexia, Sotha Sil — et la menace de Dagoth Ur.",
			en: 'The story of Morrowind through its living gods — Vivec, Almalexia, Sotha Sil — and the threat of Dagoth Ur.',
			es: 'La historia de Morrowind a traves de sus dioses vivientes — Vivec, Almalexia, Sotha Sil — y la amenaza de Dagoth Ur.'
		},
		icon: '🔱',
		color: '#3498db',
		articles: [
			'nerevar',
			'tribunal',
			'vivec',
			'almalexia',
			'sotha-sil',
			'dagoth-ur',
			'nerevarine-prophetie',
			'nerevarine',
			'morrowind'
		]
	},
	{
		id: 'dragons-dragonborn',
		names: {
			fr: 'Dragons & Enfants de Dragon',
			en: 'Dragons & Dragonborn',
			es: 'Dragones & Sangre de Dragon'
		},
		descriptions: {
			fr: "Des premiers dragons au retour d'Alduin — la prophétie de l'Enfant de Dragon et le destin de Bordeciel.",
			en: "From the first dragons to Alduin's return — the Dragonborn prophecy and the fate of Skyrim.",
			es: 'Desde los primeros dragones hasta el regreso de Alduin — la profecia del Sangre de Dragon y el destino de Skyrim.'
		},
		icon: '🐉',
		color: '#e67e22',
		articles: [
			'dragons',
			'dragon-cult',
			'thuum',
			'alduin',
			'paarthurnax',
			'grises-barbes',
			'dragonborn-prophecy',
			'enfant-de-dragon',
			'miraak'
		]
	}
];
