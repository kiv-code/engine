import { describe, expect, it } from "vitest";
import { defaultTheme, resolveTheme, themeToCssVars, tokenRef } from "./index";

describe("resolveTheme", () => {
	it("returns the default theme without an override", () => {
		expect(resolveTheme()).toBe(defaultTheme);
	});

	it("merges partial overrides without losing base tokens", () => {
		const theme = resolveTheme({ colors: { primary: "#ff0000" } });
		expect(theme.colors.primary).toBe("#ff0000");
		// The other colors are still there.
		expect(theme.colors.background).toBe(defaultTheme.colors.background);
	});
});

describe("themeToCssVars", () => {
	it("converts tokens into CSS variables with the --kiv- prefix", () => {
		const vars = themeToCssVars(resolveTheme());
		expect(vars["--kiv-color-primary"]).toBe("#6366f1");
		expect(vars["--kiv-spacing-md"]).toBe("1rem");
		expect(vars["--kiv-font-family-sans"]).toContain("system-ui");
	});
});

describe("tokenRef", () => {
	it("generates a valid var() reference", () => {
		expect(tokenRef("color", "primary")).toBe("var(--kiv-color-primary)");
	});
});
