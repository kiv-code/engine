import type { Breakpoint, KivNode } from "../types";
import { resolveLocalized, resolveResponsive } from "./resolve-value";

export interface ResolveContext {
	breakpoint: Breakpoint;
	locale: string;
	fallbackLocale?: string;
}

/** Flattens a node's props according to the active breakpoint and locale. */
export function resolveProps(
	props: Record<string, unknown>,
	ctx: ResolveContext,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		// Responsive axis first, then locale. They don't overlap in practice,
		// but chaining them is safe: if an axis doesn't apply, the value passes through unchanged.
		const afterResponsive = resolveResponsive(value, ctx.breakpoint);
		out[key] = resolveLocalized(
			afterResponsive,
			ctx.locale,
			ctx.fallbackLocale,
		);
	}
	return out;
}

/** Resolves an entire node (without touching its slots; the renderer does that while traversing). */
export function resolveNode(node: KivNode, ctx: ResolveContext) {
	return {
		id: node.id,
		type: node.type,
		props: resolveProps(node.props, ctx),
	};
}
