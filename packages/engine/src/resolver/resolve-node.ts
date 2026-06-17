import type { Breakpoint, KivNode } from "../types";
import { resolveLocalized, resolveResponsive } from "./resolve-value";

export interface ResolveContext {
	breakpoint: Breakpoint;
	locale: string;
	fallbackLocale?: string;
}

/** Aplana las props de un nodo según breakpoint y locale activos. */
export function resolveProps(
	props: Record<string, unknown>,
	ctx: ResolveContext,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		// Primero el eje responsive, luego el locale. No se solapan en la práctica,
		// pero aplicarlos en cadena es seguro: si no aplica un eje, pasa el valor tal cual.
		const afterResponsive = resolveResponsive(value, ctx.breakpoint);
		out[key] = resolveLocalized(
			afterResponsive,
			ctx.locale,
			ctx.fallbackLocale,
		);
	}
	return out;
}

/** Resuelve un nodo entero (sin tocar sus slots; eso lo hace el renderer al recorrer). */
export function resolveNode(node: KivNode, ctx: ResolveContext) {
	return {
		id: node.id,
		type: node.type,
		props: resolveProps(node.props, ctx),
	};
}
