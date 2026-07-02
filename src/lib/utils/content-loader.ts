import type { LoreEntryFrontmatter, EraSlug, CategorySlug } from '$lib/types/lore';
import type { Locale } from '$lib/i18n';

const modules = import.meta.glob('/src/content/**/*.svx', { eager: true }) as Record<
	string,
	{ default: unknown; metadata: LoreEntryFrontmatter }
>;

interface LoadedEntry {
	metadata: LoreEntryFrontmatter;
	component: unknown;
	path: string;
	locale: Locale;
}

function parseEntries(): LoadedEntry[] {
	return Object.entries(modules)
		.filter(([path, module]) => {
			if (!module.metadata) {
				console.warn(`[content-loader] Skipping ${path}: no metadata`);
				return false;
			}
			return true;
		})
		.map(([path, module]) => {
			const parts = path.split('/');
			const locale = parts[3] as Locale;
			const filename = parts.pop()?.replace('.svx', '') ?? '';
			const metadata = {
				...module.metadata,
				slug: module.metadata.slug || filename
			};
			return {
				metadata,
				component: module.default,
				path,
				locale
			};
		});
}

const entries = parseEntries();

function byLocale(locale: Locale) {
	return entries.filter((e) => e.locale === locale);
}

export function getAllEntries(locale: Locale): LoreEntryFrontmatter[] {
	return byLocale(locale).map((e) => e.metadata);
}

export function getEntriesByEra(locale: Locale, era: EraSlug): LoreEntryFrontmatter[] {
	return byLocale(locale).filter((e) => e.metadata.era === era).map((e) => e.metadata);
}

export function getEntriesByCategory(locale: Locale, category: CategorySlug): LoreEntryFrontmatter[] {
	return byLocale(locale).filter((e) => e.metadata.category === category).map((e) => e.metadata);
}

export function getEntryBySlug(locale: Locale, slug: string): { metadata: LoreEntryFrontmatter; component: unknown } | null {
	const entry = byLocale(locale).find((e) => e.metadata.slug === slug);
	if (!entry) return null;
	return { metadata: entry.metadata, component: entry.component };
}

export function getEntryByEraAndSlug(
	locale: Locale,
	era: EraSlug,
	slug: string
): { metadata: LoreEntryFrontmatter; component: unknown } | null {
	const entry = byLocale(locale).find((e) => e.metadata.era === era && e.metadata.slug === slug);
	if (!entry) return null;
	return { metadata: entry.metadata, component: entry.component };
}

export function getEntriesByTag(locale: Locale, tag: string): LoreEntryFrontmatter[] {
	return byLocale(locale)
		.filter((e) => e.metadata.tags?.includes(tag))
		.map((e) => e.metadata);
}

export function getAllTags(locale: Locale): { tag: string; count: number }[] {
	const tagMap = new Map<string, number>();
	for (const entry of byLocale(locale)) {
		for (const tag of entry.metadata.tags ?? []) {
			tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
		}
	}
	return Array.from(tagMap.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getTimelineEntries(locale: Locale): LoreEntryFrontmatter[] {
	return byLocale(locale)
		.filter((e) => e.metadata.timelineYear !== undefined)
		.map((e) => e.metadata)
		.sort((a, b) => {
			const eraOrder: EraSlug[] = ['dawn-era', 'merethic-era', 'first-era', 'second-era', 'third-era', 'fourth-era'];
			const eraA = eraOrder.indexOf(a.era);
			const eraB = eraOrder.indexOf(b.era);
			if (eraA !== eraB) return eraA - eraB;
			return (a.timelineYear ?? 0) - (b.timelineYear ?? 0);
		});
}
