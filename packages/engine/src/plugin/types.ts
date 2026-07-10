import type { EventBus } from "../events";
import type { Registry } from "../registry";
import type { ThemeTokens } from "../theme";
import type { I18nConfig } from "../types";
import type { EditorExtensionPoints } from "./types-editor";
import type { MediaProvider } from "./types-media";
import type { ServicesContainer } from "./types-services";

export interface PluginContext {
	bus: EventBus;
	registry: Registry;
	theme: ThemeTokens;
	i18n: I18nConfig | null;

	/** Present only while an editor is mounted. Absent in a pure render/SSR context. */
	editor?: EditorExtensionPoints;

	/** Present only when a MediaProvider is configured via `createEngine({ media })`. */
	media?: MediaProvider;

	/** Injected by the consumer app. Each service is optional — plugins must check before using. */
	services: ServicesContainer;
}

export interface KivPlugin {
	name: string;
	install(ctx: PluginContext): void;
	/** Called when an editor mounts and extension points become available. `ctx.editor` is guaranteed to be set. */
	onEditorReady?(ctx: PluginContext): void;
}
