import type { KivNode } from "./node";
import type { Locale } from "./values";

export interface I18nConfig {
	default: Locale;
	supported: Locale[];
	fallback?: Locale;
}

export interface KivDocument {
	/** Schema version. Enables migrations. NEVER remove it. */
	schemaVersion: number;
	/** Root node of the tree (normally a 'page'). */
	root: KivNode;
	/** Document's language configuration. */
	i18n: I18nConfig;
	/** Document-level theme overrides (optional). */
	theme?: Record<string, unknown>;
}
