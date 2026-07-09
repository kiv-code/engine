import { type ZodType, z } from "zod";
import type { Breakpoint } from "../types";
import type { FieldDescriptor } from "./field";

/** Map of property name → its descriptor. */
export type FieldMap = Record<string, FieldDescriptor>;

/** Minimal context passed to `toHtml`. Does not include `Registry` to avoid a schema↔registry cycle. */
export interface ToHtmlContext {
	locale: string;
	breakpoint: Breakpoint;
}

/**
 * Produces a node's HTML from its already-resolved props and its slots' HTML.
 * `children` maps slot name → concatenated HTML of those children.
 */
export type ToHtml = (
	props: Record<string, unknown>,
	children: Record<string, string>,
	ctx: ToHtmlContext,
) => string;

export interface NodeDefinition<F extends FieldMap = FieldMap> {
	type: string;
	fields: F;
	/** Category for grouping in the editor (optional). */
	category?: string;
	/** Human-readable name shown in the tree and palette. */
	label?: string;
	/** Icon identifier shown in the tree and palette. */
	icon?: string;
	/** Short description shown in the palette. */
	description?: string;
	/** Restricts which node types each slot can receive, e.g. `{ default: ["column"] }`. */
	slotConstraints?: Record<string, string[]>;
	/** Optional static HTML renderer (SSR, email, PDF). Without this, `renderToHtml` uses a generic `<div>`. */
	toHtml?: ToHtml;
}

export interface CompiledNode<F extends FieldMap = FieldMap> {
	type: string;
	fields: F;
	category?: string;
	label?: string;
	icon?: string;
	description?: string;
	slotConstraints?: Record<string, string[]>;
	toHtml?: ToHtml;
	/** Zod schema that validates the full props object. */
	schema: ZodType;
	/** Default props, derived from each field's `default`. */
	defaults: Record<string, unknown>;
}

export function defineNode<const F extends FieldMap>(
	def: NodeDefinition<F>,
): CompiledNode<F> {
	const shape: Record<string, ZodType> = {};
	const defaults: Record<string, unknown> = {};

	for (const [key, field] of Object.entries(def.fields)) {
		shape[key] = field.schema.optional();
		if (field.default !== undefined) {
			defaults[key] = field.default;
		}
	}

	return {
		type: def.type,
		fields: def.fields,
		category: def.category,
		label: def.label,
		icon: def.icon,
		description: def.description,
		slotConstraints: def.slotConstraints,
		toHtml: def.toHtml,
		schema: z.object(shape),
		defaults,
	};
}

/** Extracts the props type of a compiled node. */
export type InferProps<C> =
	C extends CompiledNode<infer F>
		? { [K in keyof F]?: F[K] extends FieldDescriptor<infer T> ? T : never }
		: never;
