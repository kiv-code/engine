import { describe, expect, it } from "vitest";
import type { I18nConfig } from "../types";
import { buildLocaleFallbackChain, validateI18nConfig } from "./config";

const base: I18nConfig = {
	default: "en",
	supported: ["en", "es", "fr"],
};

describe("validateI18nConfig", () => {
	it("returns the config when valid", () => {
		expect(validateI18nConfig(base)).toBe(base);
	});

	it("accepts a valid fallback", () => {
		const cfg = { ...base, fallback: "es" };
		expect(validateI18nConfig(cfg)).toBe(cfg);
	});

	it("throws when default is not in supported", () => {
		expect(() =>
			validateI18nConfig({ default: "de", supported: ["en", "es"] }),
		).toThrow(/default locale "de"/);
	});

	it("throws when fallback is not in supported", () => {
		expect(() => validateI18nConfig({ ...base, fallback: "pt" })).toThrow(
			/fallback locale "pt"/,
		);
	});
});

describe("buildLocaleFallbackChain", () => {
	it("returns [requested, default] when no fallback", () => {
		expect(buildLocaleFallbackChain("fr", base)).toEqual(["fr", "en"]);
	});

	it("returns [requested, fallback, default] with all three distinct", () => {
		const cfg = { ...base, fallback: "es" };
		expect(buildLocaleFallbackChain("fr", cfg)).toEqual(["fr", "es", "en"]);
	});

	it("deduplicates when requested === default", () => {
		expect(buildLocaleFallbackChain("en", base)).toEqual(["en"]);
	});

	it("deduplicates when requested === fallback", () => {
		const cfg = { ...base, fallback: "fr" };
		expect(buildLocaleFallbackChain("fr", cfg)).toEqual(["fr", "en"]);
	});

	it("deduplicates when fallback === default", () => {
		const cfg = { ...base, fallback: "en" };
		expect(buildLocaleFallbackChain("fr", cfg)).toEqual(["fr", "en"]);
	});

	it("chain always starts with requested locale", () => {
		const [first] = buildLocaleFallbackChain("es", base);
		expect(first).toBe("es");
	});
});
