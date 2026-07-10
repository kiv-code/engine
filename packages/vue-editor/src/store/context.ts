import type { InjectionKey, Ref } from "vue";
import type { EditorExtensions } from "../extensions";
import type { EditorStore } from "./editor-store";

export const EDITOR_STORE_KEY: InjectionKey<EditorStore> =
	Symbol("kiv-editor-store");

export const EDITOR_EXTENSIONS_KEY: InjectionKey<EditorExtensions> = Symbol(
	"kiv-editor-extensions",
);

/** The Structure panel's filter text, provided once at KivTree and read by every recursive KivTreeNode. */
export const KIV_TREE_FILTER_KEY: InjectionKey<Ref<string>> =
	Symbol("kiv-tree-filter");

/** Provided by KivTree so KivCanvas can focus the tree's search input on ⌘F. */
export const KIV_TREE_FOCUS_SEARCH_KEY: InjectionKey<() => void> = Symbol(
	"kiv-tree-focus-search",
);
