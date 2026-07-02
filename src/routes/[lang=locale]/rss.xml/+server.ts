import type { RequestHandler } from './$types';
import { getAllEntries } from '$lib/utils/content-loader';
import { eras } from '$lib/data/eras';
import type { Locale } from '$lib/i18n';
import type { EraSlug } from '$lib/types/lore';
import { getSegment } from '$lib/i18n/routes';

const SITE_URL = 'https://elder-scrolls-lore.vercel.app';

const feedTitles: Record<Locale, string> = {
	fr: 'Grand Livre du Lore — Elder Scrolls',
	en: 'Great Book of Lore — Elder Scrolls',
	es: 'Gran Libro del Lore — Elder Scrolls'
};

const feedDescriptions: Record<Locale, string> = {
	fr: "Encyclopédie interactive et complète du lore de The Elder Scrolls.",
	en: 'Complete and interactive encyclopedia of The Elder Scrolls lore.',
	es: 'Enciclopedia interactiva y completa del lore de The Elder Scrolls.'
};

const eraOrder: EraSlug[] = ['dawn-era', 'merethic-era', 'first-era', 'second-era', 'third-era', 'fourth-era'];

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function buildArticleUrl(locale: Locale, era: EraSlug, slug: string): string {
	const timelineSegment = getSegment(locale, 'timeline');
	return `${SITE_URL}/${locale}/${timelineSegment}/${era}/${slug}`;
}

export const prerender = true;

export function entries() {
	return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'es' }];
}

export const GET: RequestHandler = ({ params }) => {
	const locale = params.lang as Locale;
	const allEntries = getAllEntries(locale);

	// Sort by era order, then by title alphabetically
	const sorted = [...allEntries].sort((a, b) => {
		const eraA = eraOrder.indexOf(a.era);
		const eraB = eraOrder.indexOf(b.era);
		if (eraA !== eraB) return eraA - eraB;
		return a.title.localeCompare(b.title, locale);
	});

	const feedTitle = feedTitles[locale];
	const feedDescription = feedDescriptions[locale];
	const feedLink = `${SITE_URL}/${locale}`;
	const feedUrl = `${SITE_URL}/${locale}/rss.xml`;

	const items = sorted
		.map((entry) => {
			const link = buildArticleUrl(locale, entry.era, entry.slug);
			const eraData = eras.find((e) => e.slug === entry.era);
			const eraName = eraData?.names[locale] ?? entry.era;
			const description = entry.summary || entry.description || '';
			const categories = [eraName, ...(entry.tags ?? [])];

			return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>
${categories.map((c) => `      <category>${escapeXml(c)}</category>`).join('\n')}
    </item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${feedLink}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>${locale}</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
};
