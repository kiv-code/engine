import type { KivDocument } from "../types";

/**
 * A reusable starting point for a new page: a full `KivDocument` plus the
 * metadata a template browser needs to list it (name/description/category/
 * thumbnail). Applying a template replaces the current document — see
 * `EditorEngine.loadDocument()`.
 */
export interface PageTemplate {
	id: string;
	name: string;
	description?: string;
	category?: string;
	/** Data URI or URL shown in the template browser grid. Optional — falls back to a generic icon. */
	thumbnail?: string;
	document: KivDocument;
}
