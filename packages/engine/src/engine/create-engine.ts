import { createEventBus } from "../events";
import type { MediaProvider } from "../media";
import type { KivPlugin, PluginContext } from "../plugin";
import { createRegistry } from "../registry";
import type { ResolveContext } from "../resolver";
import { resolveNode } from "../resolver";
import type { CompiledNode } from "../schema";
import type { ServicesContainer } from "../services";
import type { ThemeOverride, ThemeTokens } from "../theme";
import { resolveTheme, themeToCssVars } from "../theme";
import type { I18nConfig, KivNode } from "../types";

export interface CreateEngineOptions {
	theme?: ThemeOverride;
	i18n?: I18nConfig;
	plugins?: KivPlugin[];
	nodes?: CompiledNode[];
	media?: { provider: MediaProvider };
	services?: ServicesContainer;
}

export interface KivEngine {
	bus: ReturnType<typeof createEventBus>;
	registry: ReturnType<typeof createRegistry>;
	theme: ThemeTokens;
	i18n: I18nConfig;
	media?: MediaProvider;
	services: ServicesContainer;
	use(plugin: KivPlugin): void;
	css(): string;
	resolve(node: KivNode, ctx: ResolveContext): ReturnType<typeof resolveNode>;
}

const DEFAULT_I18N: I18nConfig = {
	default: "en",
	supported: ["en"],
};

export function createEngine(options: CreateEngineOptions = {}): KivEngine {
	const bus = createEventBus();
	const registry = createRegistry();
	const theme = resolveTheme(options.theme);
	const i18n = options.i18n ?? DEFAULT_I18N;
	const media = options.media?.provider;
	const services = options.services ?? {};
	const installed = new Set<string>();

	if (options.nodes) {
		registry.registerMany(options.nodes);
	}

	function use(plugin: KivPlugin): void {
		if (installed.has(plugin.name)) {
			throw new Error(`[kiv] El plugin "${plugin.name}" ya está instalado.`);
		}
		const ctx: PluginContext = {
			bus,
			registry,
			theme,
			i18n,
			media,
			services,
		};
		plugin.install(ctx);
		installed.add(plugin.name);
	}

	if (options.plugins) {
		for (const plugin of options.plugins) {
			use(plugin);
		}
	}

	function css(): string {
		const vars = themeToCssVars(theme);
		const declarations = Object.entries(vars)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join("\n");
		return `:root {\n${declarations}\n}`;
	}

	function resolve(node: KivNode, ctx: ResolveContext) {
		return resolveNode(node, ctx);
	}

	return { bus, registry, theme, i18n, media, services, use, css, resolve };
}
