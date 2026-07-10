import { describe, expect, it } from "vitest";
import {
	compositeOver,
	contrastRatio,
	isLargeText,
	minimumContrastRatio,
	parseColor,
	relativeLuminance,
} from "./contrast";

describe("parseColor", () => {
	it("parses 6-digit and 3-digit hex", () => {
		expect(parseColor("#ffffff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
		expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
		expect(parseColor("#000000")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
	});

	it("parses rgb() and rgba()", () => {
		expect(parseColor("rgb(255, 0, 0)")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
		expect(parseColor("rgba(255, 0, 0, 0.5)")).toEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 0.5,
		});
	});

	it("returns null for gradients, CSS vars, and keywords", () => {
		expect(parseColor("linear-gradient(90deg, red, blue)")).toBeNull();
		expect(parseColor("var(--kiv-color-primary)")).toBeNull();
		expect(parseColor("transparent")).toBeNull();
	});
});

describe("relativeLuminance", () => {
	it("is 0 for black and 1 for white — the WCAG spec's own reference points", () => {
		expect(relativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBeCloseTo(0, 5);
		expect(relativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(
			1,
			5,
		);
	});
});

describe("contrastRatio", () => {
	it("is exactly 21:1 for black on white (WCAG's worked example)", () => {
		expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
	});

	it("is 1:1 for identical colors", () => {
		expect(contrastRatio("#808080", "#808080")).toBeCloseTo(1, 5);
	});

	it("is symmetric with respect to which color is foreground/background when both are opaque", () => {
		const a = contrastRatio("#000000", "#ffffff");
		const b = contrastRatio("#ffffff", "#000000");
		expect(a).toBeCloseTo(b as number, 5);
	});

	it("returns null when a color can't be parsed", () => {
		expect(contrastRatio("var(--x)", "#ffffff")).toBeNull();
	});

	it("composites a translucent foreground over the background before comparing", () => {
		// 50% black over white composites to mid-gray — a much smaller ratio than opaque black on white.
		const translucent = contrastRatio("rgba(0,0,0,0.5)", "#ffffff") as number;
		const opaque = contrastRatio("#000000", "#ffffff") as number;
		expect(translucent).toBeLessThan(opaque);
	});
});

describe("compositeOver", () => {
	it("returns the foreground unchanged when fully opaque", () => {
		const fg = { r: 10, g: 20, b: 30, a: 1 };
		expect(compositeOver(fg, { r: 0, g: 0, b: 0, a: 1 })).toEqual(fg);
	});

	it("blends toward the background as alpha decreases", () => {
		const result = compositeOver(
			{ r: 255, g: 255, b: 255, a: 0 },
			{ r: 0, g: 0, b: 0, a: 1 },
		);
		expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 });
	});
});

describe("isLargeText / minimumContrastRatio", () => {
	it("treats 24px+ as large regardless of weight", () => {
		expect(isLargeText(24, false)).toBe(true);
		expect(minimumContrastRatio(24, false)).toBe(3);
	});

	it("treats 18.66px+ bold as large", () => {
		expect(isLargeText(19, true)).toBe(true);
		expect(isLargeText(19, false)).toBe(false);
	});

	it("defaults to the normal-text 4.5:1 minimum", () => {
		expect(minimumContrastRatio(16, false)).toBe(4.5);
	});
});
