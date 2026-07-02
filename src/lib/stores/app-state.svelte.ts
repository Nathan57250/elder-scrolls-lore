import type { MapLocation } from '$lib/types/lore';

let mapOpen = $state(false);
let mapLocation = $state<MapLocation | null>(null);
let searchOpen = $state(false);
let bookMode = $state(false);
let sidebarOpen = $state(false);
let previewOpen = $state(false);
let previewSlug = $state<string | null>(null);
let theme = $state<'dark' | 'light'>('dark');

export function getMapState() {
	return {
		get open() {
			return mapOpen;
		},
		get location() {
			return mapLocation;
		},
		showLocation(loc: MapLocation) {
			mapLocation = loc;
			mapOpen = true;
			previewOpen = false;
		},
		close() {
			mapOpen = false;
		}
	};
}

export function getSearchState() {
	return {
		get open() {
			return searchOpen;
		},
		toggle() {
			searchOpen = !searchOpen;
		},
		close() {
			searchOpen = false;
		}
	};
}

export function getBookModeState() {
	return {
		get active() {
			return bookMode;
		},
		toggle() {
			bookMode = !bookMode;
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('bookMode', String(bookMode));
			}
		},
		init() {
			if (typeof localStorage !== 'undefined') {
				const saved = localStorage.getItem('bookMode');
				if (saved === 'true') {
					bookMode = true;
				}
			}
		}
	};
}

export function getSidebarState() {
	return {
		get open() {
			return sidebarOpen;
		},
		toggle() {
			sidebarOpen = !sidebarOpen;
		},
		close() {
			sidebarOpen = false;
		}
	};
}

export function getPreviewState() {
	return {
		get open() {
			return previewOpen;
		},
		get slug() {
			return previewSlug;
		},
		show(slug: string) {
			previewSlug = slug;
			previewOpen = true;
			mapOpen = false;
		},
		close() {
			previewOpen = false;
		}
	};
}

export function getThemeState() {
	return {
		get current() {
			return theme;
		},
		get isDark() {
			return theme === 'dark';
		},
		toggle() {
			theme = theme === 'dark' ? 'light' : 'dark';
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('light', theme === 'light');
				localStorage.setItem('theme', theme);
			}
		},
		init() {
			if (typeof localStorage !== 'undefined') {
				const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
				if (saved) {
					theme = saved;
				}
			}
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('light', theme === 'light');
			}
		}
	};
}
