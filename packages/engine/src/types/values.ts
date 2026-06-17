/** Breakpoints mobile-first. `base` = móvil, el resto sobrescribe hacia arriba. */
export interface ResponsiveObject<T> {
	base: T;
	sm?: T;
	md?: T;
	lg?: T;
	xl?: T;
}

/** Una propiedad de estilo/layout: valor único o por breakpoint. */
export type Responsive<T> = T | ResponsiveObject<T>;

export type Locale = string;

/** Un valor traducido. El `$t` lo distingue de un objeto normal. */
export interface LocalizedObject<T> {
	$t: Record<Locale, T>;
}

/** Una propiedad de contenido: valor único o traducido. */
export type Localizable<T> = T | LocalizedObject<T>;

export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
