export const version = "0.0.0";
export {
	createEventBus,
	type ErrorHandler,
	type EventBus,
	type EventHandler,
	type KivEventMap,
	type WildcardHandler,
} from "./events";

export {
	buildLocaleFallbackChain,
	validateI18nConfig,
} from "./i18n";
export {
	CURRENT_SCHEMA_VERSION,
	type Migration,
	migrateDocument,
	migrations,
} from "./migrations";
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
export {
	defaultTheme,
	resolveTheme,
	type ThemeOverride,
	type ThemeTokens,
	themeToCssVars,
	tokenRef,
} from "./theme";
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
