export const HOVER_EFFECT_OPTIONS = [
	"none",
	"lift",
	"grow",
	"glow",
	"fade",
	"grayscale",
	"underline",
] as const;

export type HoverEffect = (typeof HOVER_EFFECT_OPTIONS)[number];

const HOVER_EFFECT_CLASS: Record<Exclude<HoverEffect, "none">, string> = {
	lift: "kiv-hover-lift",
	grow: "kiv-hover-grow",
	glow: "kiv-hover-glow",
	fade: "kiv-hover-fade",
	grayscale: "kiv-hover-grayscale",
	underline: "kiv-hover-underline",
};

export function hoverEffectClass(effect: unknown): string | undefined {
	const key = typeof effect === "string" ? effect : "none";
	if (key === "none" || !(key in HOVER_EFFECT_CLASS)) return undefined;
	return HOVER_EFFECT_CLASS[key as Exclude<HoverEffect, "none">];
}

function hexToRgbTriplet(hex: string): string | null {
	const clean = hex.trim().replace(/^#/, "");
	const isShort = clean.length === 3;
	if (!isShort && clean.length !== 6) return null;
	const full = isShort
		? clean
				.split("")
				.map((c) => c + c)
				.join("")
		: clean;
	const num = Number.parseInt(full, 16);
	if (Number.isNaN(num)) return null;
	return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

/**
 * The `glow` preset's color is customizable, but `:hover` box-shadow can't be
 * inlined. The bridge is a CSS custom property: set it inline (allowed, it's
 * not a pseudo-class), and the `:hover` rule in HOVER_EFFECTS_CSS reads it
 * back via `var(--kiv-glow-rgb, ...)`.
 */
export function hoverGlowStyle(
	color: unknown,
): Record<string, string> | undefined {
	if (typeof color !== "string" || !color.trim()) return undefined;
	const triplet = hexToRgbTriplet(color);
	return triplet ? { "--kiv-glow-rgb": triplet } : undefined;
}

/**
 * Preset, token-constrained hover styles — plain CSS classes, because `:hover`
 * cannot be expressed through inline styles. Any consumer that renders these
 * classes (KivRenderer, a static renderToHtml() export, an SSR page) must
 * include this stylesheet once, the same way theme CSS vars are included.
 */
export const HOVER_EFFECTS_CSS = `
.kiv-hover-lift { transition: transform 0.18s ease, box-shadow 0.18s ease; }
.kiv-hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16); }

.kiv-hover-grow { transition: transform 0.18s ease; }
.kiv-hover-grow:hover { transform: scale(1.04); }

.kiv-hover-glow { transition: box-shadow 0.18s ease; }
.kiv-hover-glow:hover {
	box-shadow:
		0 0 0 4px rgba(var(--kiv-glow-rgb, 99, 102, 241), 0.3),
		0 0 24px rgba(var(--kiv-glow-rgb, 99, 102, 241), 0.45);
}

.kiv-hover-fade { opacity: 0.75; transition: opacity 0.18s ease; }
.kiv-hover-fade:hover { opacity: 1; }

.kiv-hover-grayscale { filter: grayscale(100%); transition: filter 0.25s ease; }
.kiv-hover-grayscale:hover { filter: grayscale(0%); }

.kiv-hover-underline { position: relative; }
.kiv-hover-underline::after {
	content: "";
	position: absolute;
	left: 0;
	bottom: -2px;
	width: 0;
	height: 2px;
	background: currentColor;
	transition: width 0.2s ease;
}
.kiv-hover-underline:hover::after { width: 100%; }
`.trim();
