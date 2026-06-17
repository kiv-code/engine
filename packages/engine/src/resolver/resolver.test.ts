import { describe, expect, it } from "vitest";
import { resolveLocalized, resolveProps, resolveResponsive } from "./index";

describe("resolveResponsive", () => {
	it("devuelve valores planos sin tocar", () => {
		expect(resolveResponsive(42, "lg")).toBe(42);
	});

	it("devuelve el valor del breakpoint exacto", () => {
		expect(resolveResponsive({ base: 16, md: 24, xl: 32 }, "md")).toBe(24);
	});

	it("hereda del breakpoint inferior más cercano (mobile-first)", () => {
		// Pide lg, solo hay base y md → hereda md.
		expect(resolveResponsive({ base: 16, md: 24 }, "lg")).toBe(24);
	});

	it("cae a base si no hay nada por debajo", () => {
		expect(resolveResponsive({ base: 16, xl: 48 }, "sm")).toBe(16);
	});
});

describe("resolveLocalized", () => {
	it("devuelve la traducción del locale activo", () => {
		expect(resolveLocalized({ $t: { es: "Hola", en: "Hi" } }, "es")).toBe(
			"Hola",
		);
	});

	it("usa el fallback si el locale no existe", () => {
		expect(resolveLocalized({ $t: { en: "Hi" } }, "pt", "en")).toBe("Hi");
	});

	it("devuelve valores planos sin tocar", () => {
		expect(resolveLocalized("plano", "es")).toBe("plano");
	});
});

describe("resolveProps", () => {
	it("aplana ambos ejes en un nodo", () => {
		const props = {
			fontSize: { base: 16, lg: 32 },
			text: { $t: { es: "Título", en: "Title" } },
			static: "sin cambios",
		};
		const out = resolveProps(props, {
			breakpoint: "lg",
			locale: "es",
			fallbackLocale: "en",
		});
		expect(out).toEqual({
			fontSize: 32,
			text: "Título",
			static: "sin cambios",
		});
	});
});
