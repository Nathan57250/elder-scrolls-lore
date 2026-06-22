import type { Era, EraSlug } from '$lib/types/lore';

export const eras: Era[] = [
	{
		slug: 'dawn-era',
		name: 'Dawn Era',
		nameFr: "L'Ère de l'Aube",
		startYear: null,
		endYear: null,
		color: '#fbbf24',
		description:
			"La création de l'Aurbis, l'émergence d'Anu et Padomay, la naissance des Et'Ada, la Convention et la création de Mundus."
	},
	{
		slug: 'merethic-era',
		name: 'Merethic Era',
		nameFr: "L'Ère Méréthique",
		startYear: -2500,
		endYear: 0,
		color: '#34d399',
		description:
			"L'arrivée des Aldmer à Tamriel, la civilisation Dwemer, la guerre des Dragons, et les exploits d'Ysgramor."
	},
	{
		slug: 'first-era',
		name: 'First Era',
		nameFr: 'Première Ère',
		startYear: 1,
		endYear: 2920,
		color: '#fb923c',
		description:
			"La fondation de l'Empire Alessien, les guerres entre Dwemer et Chimer, la disparition des Dwemer, et l'ascension du Tribunal."
	},
	{
		slug: 'second-era',
		name: 'Second Era',
		nameFr: 'Deuxième Ère',
		startYear: 1,
		endYear: 896,
		color: '#a78bfa',
		description:
			"L'Interrègne, les trois alliances (Daguefilante, Cœurébène, Domaine Aldmeri), et l'ascension de Tiber Septim."
	},
	{
		slug: 'third-era',
		name: 'Third Era',
		nameFr: 'Troisième Ère',
		startYear: 1,
		endYear: 433,
		color: '#f87171',
		description:
			"La dynastie Septim, le Simulacre Impérial, le Warp in the West, et la Crise d'Oblivion."
	},
	{
		slug: 'fourth-era',
		name: 'Fourth Era',
		nameFr: 'Quatrième Ère',
		startYear: 1,
		endYear: 201,
		color: '#38bdf8',
		description:
			"Le Concordat de l'Or Blanc, la Grande Guerre, la Guerre civile de Bordeciel, et le retour d'Alduin."
	}
];

export function getEra(slug: EraSlug): Era | undefined {
	return eras.find((e) => e.slug === slug);
}

export function getEraIndex(slug: EraSlug): number {
	return eras.findIndex((e) => e.slug === slug);
}
