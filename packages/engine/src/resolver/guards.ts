import type { LocalizedObject, ResponsiveObject } from "../types";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** ¿Es un objeto responsive ({ base, sm?, ... })? */
export function isResponsive(
	value: unknown,
): value is ResponsiveObject<unknown> {
	return isPlainObject(value) && "base" in value;
}

/** ¿Es un objeto localizado ({ $t: {...} })? */
export function isLocalized(value: unknown): value is LocalizedObject<unknown> {
	return isPlainObject(value) && "$t" in value;
}
