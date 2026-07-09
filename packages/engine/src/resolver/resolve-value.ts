import type { Breakpoint } from "../types";
import { isLocalized, isResponsive } from "./guards";

/** Mobile-first order: each level inherits from the previous one if not defined. */
const BREAKPOINT_ORDER = ["base", "sm", "md", "lg", "xl"] as const;

/** Resolves the responsive axis: returns the breakpoint's value or the inherited one. */
export function resolveResponsive<T>(
	value: unknown,
	breakpoint: Breakpoint,
): T {
	if (!isResponsive(value)) {
		return value as T;
	}
	const target = BREAKPOINT_ORDER.indexOf(breakpoint);
	// Walks down from the requested breakpoint until a value is found.
	for (let i = target; i >= 0; i--) {
		const key = BREAKPOINT_ORDER[i];
		if (key && key in value && value[key as keyof typeof value] !== undefined) {
			return value[key as keyof typeof value] as T;
		}
	}
	return value.base as T;
}

/** Resolves the locale axis: returns the translation, with a fallback chain. */
export function resolveLocalized<T>(
	value: unknown,
	locale: string,
	fallback?: string,
): T {
	if (!isLocalized(value)) {
		return value as T;
	}
	const translations = value.$t as Record<string, T>;
	if (locale in translations) {
		return translations[locale] as T;
	}
	if (fallback && fallback in translations) {
		return translations[fallback] as T;
	}
	// Last resort: the first available translation, so the render doesn't break.
	const first = Object.values(translations)[0];
	return first as T;
}
