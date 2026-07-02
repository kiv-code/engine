import type { I18nConfig } from "../types";

export function validateI18nConfig(config: I18nConfig): I18nConfig {
	if (!config.supported.includes(config.default)) {
		throw new Error(
			`i18n: default locale "${config.default}" is not in supported: [${config.supported.join(", ")}]`,
		);
	}
	if (
		config.fallback !== undefined &&
		!config.supported.includes(config.fallback)
	) {
		throw new Error(
			`i18n: fallback locale "${config.fallback}" is not in supported: [${config.supported.join(", ")}]`,
		);
	}
	return config;
}

export function buildLocaleFallbackChain(
	requested: string,
	config: I18nConfig,
): [string, ...string[]] {
	const chain: string[] = [];
	const seen = new Set<string>();

	const push = (locale: string) => {
		if (!seen.has(locale)) {
			seen.add(locale);
			chain.push(locale);
		}
	};

	push(requested);
	if (config.fallback !== undefined) push(config.fallback);
	push(config.default);

	return chain as [string, ...string[]];
}
