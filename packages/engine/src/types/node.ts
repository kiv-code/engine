import type { Responsive } from "./values";

export interface KivNode {
	/** Unique identifier within the document. */
	id: string;
	/** Registered type: 'section', 'heading', or a custom one like 'hero-banner'. */
	type: string;
	/** Node properties. The resolver converts them into flat props. */
	props: Record<string, unknown>;
	/** Children organized by named slot. */
	slots?: Record<string, KivNode[]>;
	/** Plugin data. Does NOT affect rendering. */
	meta?: Record<string, unknown>;
	/** If true, the editor blocks selection/editing/dragging of this node. */
	locked?: boolean;
	/** Node visibility, optionally per breakpoint. Visible by default. */
	visible?: Responsive<boolean>;
}
