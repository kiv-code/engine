import { describe, expect, it } from "vitest";
import { resolveLocalized, resolveProps, resolveResponsive } from "./index";

describe("resolveResponsive", () => {
	it("returns plain values untouched", () => {
		expect(resolveResponsive(42, "lg")).toBe(42);
	});

	it("returns the exact breakpoint's value", () => {
		expect(resolveResponsive({ base: 16, md: 24, xl: 32 }, "md")).toBe(24);
	});

	it("inherits from the nearest lower breakpoint (mobile-first)", () => {
		// Requests lg, only base and md exist → inherits md.
		expect(resolveResponsive({ base: 16, md: 24 }, "lg")).toBe(24);
	});

	it("falls back to base if nothing below is defined", () => {
		expect(resolveResponsive({ base: 16, xl: 48 }, "sm")).toBe(16);
	});
});

describe("resolveLocalized", () => {
	it("returns the active locale's translation", () => {
		expect(resolveLocalized({ $t: { es: "Hola", en: "Hi" } }, "es")).toBe(
			"Hola",
		);
	});

	it("uses the fallback if the locale doesn't exist", () => {
		expect(resolveLocalized({ $t: { en: "Hi" } }, "pt", "en")).toBe("Hi");
	});

	it("returns plain values untouched", () => {
		expect(resolveLocalized("plain", "es")).toBe("plain");
	});
});

describe("resolveProps", () => {
	it("flattens both axes on a node", () => {
		const props = {
			fontSize: { base: 16, lg: 32 },
			text: { $t: { es: "Título", en: "Title" } },
			static: "unchanged",
		};
		const out = resolveProps(props, {
			breakpoint: "lg",
			locale: "es",
			fallbackLocale: "en",
		});
		expect(out).toEqual({
			fontSize: 32,
			text: "Título",
			static: "unchanged",
		});
	});
});
