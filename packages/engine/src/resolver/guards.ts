import type { LocalizedObject, ResponsiveObject } from "../types";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Is this a responsive object ({ base, sm?, ... })? */
export function isResponsive(
	value: unknown,
): value is ResponsiveObject<unknown> {
	return isPlainObject(value) && "base" in value;
}

/** Is this a localized object ({ $t: {...} })? */
export function isLocalized(value: unknown): value is LocalizedObject<unknown> {
	return isPlainObject(value) && "$t" in value;
}
