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

/** Escapes a value for safe use as HTML text content or a quoted attribute value. */
export function escapeHtml(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
