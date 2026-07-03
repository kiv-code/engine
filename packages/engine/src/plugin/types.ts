import type { EventBus } from "../events";
import type { Registry } from "../registry";
import type { ThemeTokens } from "../theme";
import type { I18nConfig } from "../types";

export interface PluginContext {
	bus: EventBus;
	registry: Registry;
	theme: ThemeTokens;
	i18n: I18nConfig | null;
}

export interface KivPlugin {
	name: string;
	install(ctx: PluginContext): void;
}
