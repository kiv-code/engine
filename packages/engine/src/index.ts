export const version = "0.0.0";

export { createRegistry, Registry } from "./registry";
export {
	isLocalized,
	isResponsive,
	type ResolveContext,
	resolveLocalized,
	resolveNode,
	resolveProps,
	resolveResponsive,
} from "./resolver";
export {
	type CompiledNode,
	defineNode,
	type FieldControl,
	type FieldDescriptor,
	type FieldMap,
	f,
	type InferProps,
	type NodeDefinition,
} from "./schema";
export type {
	Breakpoint,
	I18nConfig,
	KivDocument,
	KivNode,
	Locale,
	Localizable,
	LocalizedObject,
	Responsive,
	ResponsiveObject,
} from "./types";
