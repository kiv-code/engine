import type { ZodType } from "zod";

/** Which control the inspector shows for this field. */
export type FieldControl =
	| "text"
	| "textarea"
	| "number"
	| "select"
	| "boolean"
	| "color";

/** Descriptor of a node's property. */
export interface FieldDescriptor<T = unknown> {
	/** Zod validator for the base value (not wrapped in responsive/locale). */
	schema: ZodType;
	/** Control that the inspector renders. */
	control: FieldControl;
	/** Default value when creating the node. */
	default?: T;
	/** Label visible in the inspector. */
	label?: string;
	/** Group/section in the inspector (e.g. "Layout", "Typography", "Background"). */
	group?: string;
	/** If true, the value can be translated per locale. */
	localizable?: boolean;
	/** If true, the value can vary per breakpoint. */
	responsive?: boolean;
	/** Options, only for the 'select' control. */
	options?: ReadonlyArray<{ label: string; value: T }>;
	/** If true, the field can be edited inline on the canvas (click directly on the node). */
	inline?: boolean;
	/**
	 * Conditional visibility in the inspector: the field is only shown if the
	 * node's `field` prop equals one of `equals`. Enables dynamic forms
	 * (e.g. showing gradient fields only if backgroundType=gradient).
	 * Does not affect rendering or the JSON — it's purely a hint for the inspector.
	 */
	showIf?: { field: string; equals: string | string[] };
	/** Placeholder text shown in the control when empty. */
	placeholder?: string;
	/** Helper text shown below the control in the inspector. */
	hint?: string;
	/** Marks the field as required (visual hint for the inspector). */
	required?: boolean;
	/** Hides the field from the inspector (for system props). */
	hidden?: boolean;
	/**
	 * Override the control with a plugin-registered custom control name.
	 * If set, the editor checks extension points for a control with this name
	 * and renders it instead of the default control type.
	 */
	pluginControl?: string;
}
