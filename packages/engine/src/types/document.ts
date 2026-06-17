import type { KivNode } from "./node";
import type { Locale } from "./values";

export interface I18nConfig {
	default: Locale;
	supported: Locale[];
	fallback?: Locale;
}

export interface KivDocument {
	/** Versión del schema. Habilita migraciones. NUNCA lo quites. */
	schemaVersion: number;
	/** Nodo raíz del árbol (normalmente un 'page'). */
	root: KivNode;
	/** Configuración de idiomas del documento. */
	i18n: I18nConfig;
	/** Overrides de theme a nivel de documento (opcional). */
	theme?: Record<string, unknown>;
}
