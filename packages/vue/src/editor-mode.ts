import type { InjectionKey } from "vue";

/** Provided as `true` by KivRenderer when used inside the editor canvas.
 *  Nodes use this to disable navigation, enable inline editing, etc. */
export const KIV_EDITOR_MODE_KEY: InjectionKey<boolean> =
	Symbol("kiv-editor-mode");
