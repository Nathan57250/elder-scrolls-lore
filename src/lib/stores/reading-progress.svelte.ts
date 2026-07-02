let progress = $state<Record<string, number>>({});

function loadFromStorage(): Record<string, number> {
	if (typeof localStorage === 'undefined') return {};
	try {
		const raw = localStorage.getItem('reading-progress');
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function saveToStorage(data: Record<string, number>) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem('reading-progress', JSON.stringify(data));
	} catch {
		// Storage full or unavailable — silently ignore
	}
}

export function getReadingProgressState() {
	return {
		init() {
			progress = loadFromStorage();
		},
		getProgress(slug: string): number {
			return progress[slug] ?? 0;
		},
		setProgress(slug: string, percent: number) {
			const clamped = Math.min(100, Math.max(0, Math.round(percent)));
			const current = progress[slug] ?? 0;
			// Only update if new progress is higher (never go backwards)
			if (clamped > current) {
				progress[slug] = clamped;
				saveToStorage(progress);
			}
		},
		getAllProgress(): Record<string, number> {
			return progress;
		}
	};
}
