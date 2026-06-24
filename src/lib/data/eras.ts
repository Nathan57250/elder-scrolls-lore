import type { Era, EraSlug } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

export const eras: Era[] = [
	{
		slug: 'dawn-era',
		names: {
			fr: "L'Ère de l'Aube",
			en: 'The Dawn Era',
			es: 'La Era del Amanecer'
		},
		startYear: null,
		endYear: null,
		color: '#fbbf24',
		descriptions: {
			fr: "La création de l'Aurbis, l'émergence d'Anu et Padomay, la naissance des Et'Ada, la Convention et la création de Mundus.",
			en: "The creation of the Aurbis, the emergence of Anu and Padomay, the birth of the Et'Ada, the Convention, and the creation of Mundus.",
			es: "La creación del Aurbis, la emergencia de Anu y Padomay, el nacimiento de los Et'Ada, la Convención y la creación de Mundus."
		}
	},
	{
		slug: 'merethic-era',
		names: {
			fr: "L'Ère Méréthique",
			en: 'The Merethic Era',
			es: 'La Era Merética'
		},
		startYear: -2500,
		endYear: 0,
		color: '#34d399',
		descriptions: {
			fr: "L'arrivée des Aldmer à Tamriel, la civilisation Dwemer, la guerre des Dragons, et les exploits d'Ysgramor.",
			en: 'The arrival of the Aldmer in Tamriel, the Dwemer civilization, the Dragon War, and the exploits of Ysgramor.',
			es: 'La llegada de los Aldmer a Tamriel, la civilización Dwemer, la guerra de los Dragones y las hazañas de Ysgramor.'
		}
	},
	{
		slug: 'first-era',
		names: {
			fr: 'Première Ère',
			en: 'First Era',
			es: 'Primera Era'
		},
		startYear: 1,
		endYear: 2920,
		color: '#fb923c',
		descriptions: {
			fr: "La fondation de l'Empire Alessien, les guerres entre Dwemer et Chimer, la disparition des Dwemer, et l'ascension du Tribunal.",
			en: 'The founding of the Alessian Empire, the wars between Dwemer and Chimer, the disappearance of the Dwemer, and the rise of the Tribunal.',
			es: 'La fundación del Imperio Alessiano, las guerras entre Dwemer y Chimer, la desaparición de los Dwemer y el ascenso del Tribunal.'
		}
	},
	{
		slug: 'second-era',
		names: {
			fr: 'Deuxième Ère',
			en: 'Second Era',
			es: 'Segunda Era'
		},
		startYear: 1,
		endYear: 896,
		color: '#a78bfa',
		descriptions: {
			fr: "L'Interrègne, les trois alliances (Daguefilante, Cœurébène, Domaine Aldmeri), et l'ascension de Tiber Septim.",
			en: 'The Interregnum, the three alliances (Daggerfall, Ebonheart, Aldmeri Dominion), and the rise of Tiber Septim.',
			es: 'El Interregno, las tres alianzas (Daggerfall, Ebonheart, Dominio Aldmeri) y el ascenso de Tiber Septim.'
		}
	},
	{
		slug: 'third-era',
		names: {
			fr: 'Troisième Ère',
			en: 'Third Era',
			es: 'Tercera Era'
		},
		startYear: 1,
		endYear: 433,
		color: '#f87171',
		descriptions: {
			fr: "La dynastie Septim, le Simulacre Impérial, le Warp in the West, et la Crise d'Oblivion.",
			en: 'The Septim dynasty, the Imperial Simulacrum, the Warp in the West, and the Oblivion Crisis.',
			es: 'La dinastía Septim, el Simulacro Imperial, la Distorsión del Oeste y la Crisis de Oblivion.'
		}
	},
	{
		slug: 'fourth-era',
		names: {
			fr: 'Quatrième Ère',
			en: 'Fourth Era',
			es: 'Cuarta Era'
		},
		startYear: 1,
		endYear: 201,
		color: '#38bdf8',
		descriptions: {
			fr: "Le Concordat de l'Or Blanc, la Grande Guerre, la Guerre civile de Bordeciel, et le retour d'Alduin.",
			en: "The White-Gold Concordat, the Great War, the Skyrim Civil War, and Alduin's return.",
			es: 'El Concordato del Oro Blanco, la Gran Guerra, la Guerra Civil de Skyrim y el regreso de Alduin.'
		}
	}
];

export function getEra(slug: EraSlug): Era | undefined {
	return eras.find((e) => e.slug === slug);
}

export function getEraIndex(slug: EraSlug): number {
	return eras.findIndex((e) => e.slug === slug);
}

export function getEraName(era: Era, locale: Locale): string {
	return era.names[locale];
}

export function getEraDescription(era: Era, locale: Locale): string {
	return era.descriptions[locale];
}
