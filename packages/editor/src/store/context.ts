import type { InjectionKey } from "vue";
import type { EditorStore } from "./editor-store";

export const EDITOR_STORE_KEY: InjectionKey<EditorStore> =
	Symbol("kiv-editor-store");
