declare global {
	interface Window {
		searchLogger?: {
			dump: () => unknown[];
			export: () => string;
			clear: () => void;
			logs: () => void;
		};
	}
}
export {};
