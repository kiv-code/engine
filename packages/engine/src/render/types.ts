import type { Registry } from "../registry";
import type { Breakpoint } from "../types";

export interface RenderContext {
	registry: Registry;
	locale: string;
	breakpoint: Breakpoint;
	fallbackLocale?: string;
}

export interface RenderOptions {
	registry: Registry;
	/** Defaults to `document.i18n.default`. */
	locale?: string;
	/** Defaults to `"base"`. */
	breakpoint?: Breakpoint;
}
