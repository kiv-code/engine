import { defaultTheme } from "./default-theme";
import type { ThemeOverride, ThemeTokens } from "./types";

/** Merges a partial override onto the default theme. */
export function resolveTheme(override?: ThemeOverride): ThemeTokens {
	if (!override) {
		return defaultTheme;
	}
	const merged = {} as ThemeTokens;
	for (const group of Object.keys(defaultTheme) as (keyof ThemeTokens)[]) {
		merged[group] = {
			...defaultTheme[group],
			...override[group],
		} as ThemeTokens[typeof group];
	}
	return merged;
}

/**
 * Converts the tokens into CSS variables.
 * { colors: { primary: "#..." } } → { "--kiv-color-primary": "#..." }
 */
export function themeToCssVars(theme: ThemeTokens): Record<string, string> {
	const vars: Record<string, string> = {};
	const prefixes: Record<keyof ThemeTokens, string> = {
		colors: "color",
		spacing: "spacing",
		radius: "radius",
		fontFamily: "font-family",
		fontSize: "font-size",
		fontWeight: "font-weight",
		shadow: "shadow",
	};
	for (const group of Object.keys(theme) as (keyof ThemeTokens)[]) {
		const prefix = prefixes[group];
		for (const [name, value] of Object.entries(theme[group])) {
			vars[`--kiv-${prefix}-${name}`] = value;
		}
	}
	return vars;
}

/** Reference to a token as a usable CSS value: tokenRef("color", "primary") → "var(--kiv-color-primary)" */
export function tokenRef(group: string, name: string): string {
	return `var(--kiv-${group}-${name})`;
}
