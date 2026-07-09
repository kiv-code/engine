/** Mobile-first breakpoints. `base` = mobile, the rest override upward. */
export interface ResponsiveObject<T> {
	base: T;
	sm?: T;
	md?: T;
	lg?: T;
	xl?: T;
}

/** A style/layout property: single value or per breakpoint. */
export type Responsive<T> = T | ResponsiveObject<T>;

export type Locale = string;

/** A translated value. The `$t` distinguishes it from a normal object. */
export interface LocalizedObject<T> {
	$t: Record<Locale, T>;
}

/** A content property: single value or translated. */
export type Localizable<T> = T | LocalizedObject<T>;

export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
