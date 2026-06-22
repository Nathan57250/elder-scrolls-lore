import type { LoreEntryFrontmatter, EraSlug, CategorySlug } from '$lib/types/lore';

const modules = import.meta.glob('/src/content/**/*.svx', { eager: true }) as Record<
	string,
	{ default: unknown; metadata: LoreEntryFrontmatter }
>;

interface LoadedEntry {
	metadata: LoreEntryFrontmatter;
	component: unknown;
	path: string;
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
		.map(([path, module]) => ({
			metadata: module.metadata,
			component: module.default,
			path
		}));
}

const entries = parseEntries();

export function getAllEntries(): LoreEntryFrontmatter[] {
	return entries.map((e) => e.metadata);
}

export function getEntriesByEra(era: EraSlug): LoreEntryFrontmatter[] {
	return entries.filter((e) => e.metadata.era === era).map((e) => e.metadata);
}

export function getEntriesByCategory(category: CategorySlug): LoreEntryFrontmatter[] {
	return entries.filter((e) => e.metadata.category === category).map((e) => e.metadata);
}

export function getEntryBySlug(slug: string): { metadata: LoreEntryFrontmatter; component: unknown } | null {
	const entry = entries.find((e) => e.metadata.slug === slug);
	if (!entry) return null;
	return { metadata: entry.metadata, component: entry.component };
}

export function getEntryByEraAndSlug(
	era: EraSlug,
	slug: string
): { metadata: LoreEntryFrontmatter; component: unknown } | null {
	const entry = entries.find((e) => e.metadata.era === era && e.metadata.slug === slug);
	if (!entry) return null;
	return { metadata: entry.metadata, component: entry.component };
}

export function getEntriesByTag(tag: string): LoreEntryFrontmatter[] {
	return entries
		.filter((e) => e.metadata.tags?.includes(tag))
		.map((e) => e.metadata);
}

export function getTimelineEntries(): LoreEntryFrontmatter[] {
	return entries
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
