import type { Breakpoint } from "../types";
import { isLocalized, isResponsive } from "./guards";

/** Orden mobile-first: cada nivel hereda del anterior si no está definido. */
const BREAKPOINT_ORDER = ["base", "sm", "md", "lg", "xl"] as const;

/** Resuelve el eje responsive: devuelve el valor del breakpoint o el heredado. */
export function resolveResponsive<T>(
	value: unknown,
	breakpoint: Breakpoint,
): T {
	if (!isResponsive(value)) {
		return value as T;
	}
	const target = BREAKPOINT_ORDER.indexOf(breakpoint);
	// Recorre desde el breakpoint pedido hacia abajo hasta encontrar un valor.
	for (let i = target; i >= 0; i--) {
		const key = BREAKPOINT_ORDER[i];
		if (key && key in value && value[key as keyof typeof value] !== undefined) {
			return value[key as keyof typeof value] as T;
		}
	}
	return value.base as T;
}

/** Resuelve el eje locale: devuelve la traducción, con cadena de fallback. */
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
	// Último recurso: la primera traducción disponible, para no romper el render.
	const first = Object.values(translations)[0];
	return first as T;
}
