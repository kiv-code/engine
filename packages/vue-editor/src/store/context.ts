import type { InjectionKey } from "vue";
import type { EditorExtensions } from "../extensions";
import type { EditorStore } from "./editor-store";

export const EDITOR_STORE_KEY: InjectionKey<EditorStore> =
	Symbol("kiv-editor-store");

export const EDITOR_EXTENSIONS_KEY: InjectionKey<EditorExtensions> = Symbol(
	"kiv-editor-extensions",
);
