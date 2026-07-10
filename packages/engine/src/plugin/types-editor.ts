import type { KivDocument, KivNode } from "../types";

/**
 * Opaque reference to a UI component. The engine core never renders anything —
 * each renderer package (Vue, React) casts this to its own component type.
 */
export type ComponentDef = unknown;

export interface ToolbarButton {
	id: string;
	label: string;
	icon?: string;
	onClick(): void;
}

export interface PaletteItem {
	type: string;
	label: string;
	icon?: string;
	description?: string;
	category?: string;
}

export interface InspectorTab {
	name: string;
	label: string;
	component: ComponentDef;
}

export interface ShortcutDef {
	keys: string;
	description?: string;
	onTrigger(): void;
}

/** Extension points exposed to plugins while an editor is mounted. */
export interface EditorExtensionPoints {
	addToolbarButton(btn: ToolbarButton): void;
	addPanel(name: string, component: ComponentDef): void;
	addPaletteItem(item: PaletteItem): void;
	addInspectorTab(name: string, component: ComponentDef): void;
	addFieldControl(type: string, component: ComponentDef): void;
	addKeyboardShortcut(sc: ShortcutDef): void;
	onNodeSelect(cb: (node: KivNode) => void): void;
	onNodeCreate(cb: (node: KivNode) => void): void;
	onDocumentChange(cb: (doc: KivDocument) => void): void;
}
