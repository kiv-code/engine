export interface Rgb {
	r: number;
	g: number;
	b: number;
	a: number;
}

/** Parses "#rgb", "#rrggbb", "rgb(...)", or "rgba(...)". Returns null for anything else (gradients, CSS vars, keywords). */
export function parseColor(input: string): Rgb | null {
	const s = input.trim();

	const shortHex = /^#([0-9a-f]{3})$/i.exec(s);
	if (shortHex?.[1]) {
		const [r, g, b] = shortHex[1]
			.split("")
			.map((c) => Number.parseInt(c + c, 16));
		return { r: r ?? 0, g: g ?? 0, b: b ?? 0, a: 1 };
	}

	const longHex = /^#([0-9a-f]{6})$/i.exec(s);
	if (longHex?.[1]) {
		const hex = longHex[1];
		return {
			r: Number.parseInt(hex.slice(0, 2), 16),
			g: Number.parseInt(hex.slice(2, 4), 16),
			b: Number.parseInt(hex.slice(4, 6), 16),
			a: 1,
		};
	}

	const rgb =
		/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(
			s,
		);
	if (rgb) {
		return {
			r: Number(rgb[1]),
			g: Number(rgb[2]),
			b: Number(rgb[3]),
			a: rgb[4] !== undefined ? Number(rgb[4]) : 1,
		};
	}

	return null;
}

/** Alpha-composites `fg` over the OPAQUE `bg`, per the standard "over" operator. */
export function compositeOver(fg: Rgb, bg: Rgb): Rgb {
	if (fg.a >= 1) return fg;
	const a = fg.a;
	return {
		r: fg.r * a + bg.r * (1 - a),
		g: fg.g * a + bg.g * (1 - a),
		b: fg.b * a + bg.b * (1 - a),
		a: 1,
	};
}

function srgbChannelToLinear(c: number): number {
	const cs = c / 255;
	return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance, 0 (black) – 1 (white). */
export function relativeLuminance(color: Rgb): number {
	return (
		0.2126 * srgbChannelToLinear(color.r) +
		0.7152 * srgbChannelToLinear(color.g) +
		0.0722 * srgbChannelToLinear(color.b)
	);
}

/**
 * WCAG contrast ratio (1–21) between two CSS color strings. `fg`'s alpha is
 * composited over `bg` first, since a translucent foreground's EFFECTIVE
 * color depends on what's behind it. Returns null if either color can't be
 * parsed (gradients, CSS variables, keywords) — the caller should skip the
 * rule rather than report a false negative/positive.
 */
export function contrastRatio(fg: string, bg: string): number | null {
	const fgColor = parseColor(fg);
	const bgColor = parseColor(bg);
	if (!fgColor || !bgColor) return null;
	const composited = compositeOver(fgColor, bgColor);
	const l1 = relativeLuminance(composited);
	const l2 = relativeLuminance(bgColor);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG 2.1 AA large-text threshold: >=24px, or >=18.66px (14pt) when bold. */
export function isLargeText(sizePx: number, bold: boolean): boolean {
	return sizePx >= 24 || (sizePx >= 18.66 && bold);
}

/** WCAG 2.1 AA minimum ratio for the given text size/weight. */
export function minimumContrastRatio(sizePx: number, bold: boolean): number {
	return isLargeText(sizePx, bold) ? 3 : 4.5;
}
