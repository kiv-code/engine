/** Converts a camelCase inline-style object into a `key: value;` CSS string, skipping empty values. */
export function styleToString(
	style: Record<string, string | number | undefined>,
): string {
	const declarations = Object.entries(style)
		.filter(
			([, value]) => value !== undefined && value !== null && value !== "",
		)
		.map(([key, value]) => `${kebabCase(key)}: ${value}`);
	return declarations.length ? `${declarations.join("; ")};` : "";
}

function kebabCase(key: string): string {
	return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Forces a pasted SVG icon to a consistent size (1em, scaled by font-size),
 * mirroring the `.kiv-btn-icon :deep(svg)` rule the Vue renderer applies via
 * scoped CSS. The static HTML export has no such stylesheet, so without this
 * the icon's own `width`/`height` attributes win outright — two buttons with
 * identical `size` props can render visibly different if their pasted icons
 * came from different sources (e.g. 16x16 vs 24x24).
 */
export function normalizeSvgIconSize(svg: string): string {
	if (!svg.trim().startsWith("<svg")) return svg;
	const sizeStyle = "width:1em;height:1em;display:block";
	return svg.replace(/<svg([^>]*)>/, (_match, attrs: string) => {
		if (/\sstyle\s*=/.test(attrs)) {
			return `<svg${attrs.replace(
				/\sstyle\s*=\s*(["'])(.*?)\1/,
				(_m, q: string, existing: string) =>
					` style=${q}${existing};${sizeStyle}${q}`,
			)}>`;
		}
		return `<svg${attrs} style="${sizeStyle}">`;
	});
}

/** Escapes a value for safe use as HTML text content or a quoted attribute value. */
export function escapeHtml(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
