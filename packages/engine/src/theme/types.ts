export interface ThemeTokens {
	colors: Record<string, string>;
	spacing: Record<string, string>;
	radius: Record<string, string>;
	fontFamily: Record<string, string>;
	fontSize: Record<string, string>;
	fontWeight: Record<string, string>;
	shadow: Record<string, string>;
}

/** Override parcial: el usuario solo define lo que quiere cambiar. */
export type ThemeOverride = {
	[K in keyof ThemeTokens]?: Partial<ThemeTokens[K]>;
};
