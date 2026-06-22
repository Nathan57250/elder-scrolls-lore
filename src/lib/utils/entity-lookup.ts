import { getAllEntries } from './content-loader';
import type { LoreEntryFrontmatter } from '$lib/types/lore';

export interface EntityMatch {
	metadata: LoreEntryFrontmatter;
	href: string;
}

const lookupMap = new Map<string, EntityMatch>();

function normalize(s: string): string {
	return s.toLowerCase().trim();
}

function extractShortNames(title: string): string[] {
	const names: string[] = [title];

	// Split on common title separators
	const separators = [' — ', ' : ', ' – ', ', '];
	for (const sep of separators) {
		if (title.includes(sep)) {
			names.push(title.split(sep)[0]);
		}
	}

	// Extract content in parentheses: "L'Enfant de Dragon (Dovahkiin)" → "Dovahkiin"
	const parenMatch = title.match(/\(([^)]+)\)/);
	if (parenMatch) {
		names.push(parenMatch[1]);
	}

	// "X et les/la/le Y" → extract "X"
	const etMatch = title.match(/^(.+?)\s+et\s+(les?|la|l'|des|du)\s/i);
	if (etMatch) {
		names.push(etMatch[1]);
	}

	// "Sainte X" / "Saint X" → also index "X"
	for (const name of [...names]) {
		if (/^sainte?\s/i.test(name)) {
			names.push(name.replace(/^sainte?\s/i, ''));
		}
	}

	// Strip leading articles: "Le Thalmor" → "Thalmor", "L'Aurbis" → "Aurbis"
	const articles = ['le ', 'la ', "l'", 'les ', 'un ', 'une '];
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

function buildLookup() {
	if (lookupMap.size > 0) return;
	for (const entry of getAllEntries()) {
		const href = `/chronologie/${entry.era}/${entry.slug}`;
		const match: EntityMatch = { metadata: entry, href };

		for (const name of extractShortNames(entry.title)) {
			const key = normalize(name);
			if (key.length >= 3) {
				lookupMap.set(key, match);
			}
		}

		if (entry.aliases) {
			for (const alias of entry.aliases) {
				lookupMap.set(normalize(alias), match);
			}
		}
	}
}

export function findEntity(text: string): EntityMatch | undefined {
	buildLookup();
	return lookupMap.get(normalize(text));
}
