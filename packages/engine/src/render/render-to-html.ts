import { resolveProps } from "../resolver";
import type { KivDocument, KivNode } from "../types";
import type { RenderContext, RenderOptions } from "./types";

function escapeAttr(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

/** No registered `toHtml` for this node type: an inert `<div>` carrying its children and identity. */
function renderFallback(
	node: KivNode,
	children: Record<string, string>,
): string {
	const inner = Object.values(children).join("");
	return `<div data-kiv-type="${escapeAttr(node.type)}" data-kiv-node-id="${escapeAttr(node.id)}">${inner}</div>`;
}

function renderNode(node: KivNode, ctx: RenderContext): string {
	const compiled = ctx.registry.get(node.type);

	const children: Record<string, string> = {};
	for (const [slotName, slotChildren] of Object.entries(node.slots ?? {})) {
		children[slotName] = slotChildren
			.map((child) => renderNode(child, ctx))
			.join("");
	}

	if (!compiled?.toHtml) {
		return renderFallback(node, children);
	}

	const props = resolveProps(node.props, {
		locale: ctx.locale,
		breakpoint: ctx.breakpoint,
		fallbackLocale: ctx.fallbackLocale,
	});
	return compiled.toHtml(props, children, {
		locale: ctx.locale,
		breakpoint: ctx.breakpoint,
	});
}

/**
 * Renders a KivDocument to a static HTML string — for SSR, email, or PDF export.
 * Node types with a `toHtml` implementation render themselves with inline styles;
 * types without one fall back to a bare `<div data-kiv-type>` wrapper.
 */
export function renderToHtml(
	document: KivDocument,
	options: RenderOptions,
): string {
	const ctx: RenderContext = {
		registry: options.registry,
		locale: options.locale ?? document.i18n.default,
		breakpoint: options.breakpoint ?? "base",
		fallbackLocale: document.i18n.fallback,
	};
	return renderNode(document.root, ctx);
}
