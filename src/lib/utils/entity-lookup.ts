import { getAllEntries } from './content-loader';
import { localePath } from '$lib/i18n/routes';
import type { LoreEntryFrontmatter } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

export interface EntityMatch {
	metadata: LoreEntryFrontmatter;
	href: string;
}

const lookupMaps = new Map<Locale, Map<string, EntityMatch>>();

function normalize(s: string): string {
	return s.toLowerCase().trim();
}

function extractShortNames(title: string): string[] {
	const names: string[] = [title];

	const separators = [' — ', ' : ', ' – ', ', '];
	for (const sep of separators) {
		if (title.includes(sep)) {
			names.push(title.split(sep)[0]);
		}
	}

	const parenMatch = title.match(/\(([^)]+)\)/);
	if (parenMatch) {
		names.push(parenMatch[1]);
	}

	const etMatch = title.match(/^(.+?)\s+et\s+(les?|la|l'|des|du)\s/i);
	if (etMatch) {
		names.push(etMatch[1]);
	}

	for (const name of [...names]) {
		if (/^sainte?\s/i.test(name)) {
			names.push(name.replace(/^sainte?\s/i, ''));
		}
	}

	const articles = ['le ', 'la ', "l'", 'les ', 'un ', 'une ', 'the ', 'el ', 'la ', 'los ', 'las '];
	for (const name of [...names]) {
		const lower = name.toLowerCase();
		for (const art of articles) {
			if (lower.startsWith(art)) {
				names.push(name.slice(art.length));
			}
		}
	}

	return names;
}

function buildLookup(locale: Locale) {
	if (lookupMaps.has(locale)) return;
	const map = new Map<string, EntityMatch>();

	for (const entry of getAllEntries(locale)) {
		const href = localePath(locale, 'timeline', entry.era, entry.slug);
		const match: EntityMatch = { metadata: entry, href };

		for (const name of extractShortNames(entry.title)) {
			const key = normalize(name);
			if (key.length >= 3) {
				map.set(key, match);
			}
		}

		if (entry.aliases) {
			for (const alias of entry.aliases) {
				map.set(normalize(alias), match);
			}
		}
	}

	lookupMaps.set(locale, map);
}

export function findEntity(locale: Locale, text: string): EntityMatch | undefined {
	buildLookup(locale);
	return lookupMaps.get(locale)?.get(normalize(text));
}
