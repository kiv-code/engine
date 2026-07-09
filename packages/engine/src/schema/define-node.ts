import { type ZodType, z } from "zod";
import type { FieldDescriptor } from "./field";

/** Mapa de nombre de propiedad → su descriptor. */
export type FieldMap = Record<string, FieldDescriptor>;

export interface NodeDefinition<F extends FieldMap = FieldMap> {
	type: string;
	fields: F;
	/** Categoría para agrupar en el editor (opcional). */
	category?: string;
	/** Nombre legible mostrado en el árbol y la paleta. */
	label?: string;
	/** Identificador de ícono mostrado en el árbol y la paleta. */
	icon?: string;
	/** Descripción corta mostrada en la paleta. */
	description?: string;
	/** Restringe qué tipos de nodo puede recibir cada slot, e.g. `{ default: ["column"] }`. */
	slotConstraints?: Record<string, string[]>;
}

export interface CompiledNode<F extends FieldMap = FieldMap> {
	type: string;
	fields: F;
	category?: string;
	label?: string;
	icon?: string;
	description?: string;
	slotConstraints?: Record<string, string[]>;
	/** Schema Zod que valida el objeto de props completo. */
	schema: ZodType;
	/** Props por defecto, derivadas de los `default` de cada field. */
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
		schema: z.object(shape),
		defaults,
	};
}

/** Extrae el tipo de props de un nodo compilado. */
export type InferProps<C> =
	C extends CompiledNode<infer F>
		? { [K in keyof F]?: F[K] extends FieldDescriptor<infer T> ? T : never }
		: never;
