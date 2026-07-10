// Human-readable labels for node types — used in tree and canvas overlays
export const NODE_LABELS: Record<string, string> = {
	page: "Page",
	section: "Section",
	container: "Container",
	grid: "Grid",
	column: "Column",
	stack: "Group",
	heading: "Heading",
	text: "Text",
	button: "Button",
	image: "Image",
};

// Short label for canvas overlay badges
export const NODE_LABELS_SHORT: Record<string, string> = {
	page: "Page",
	section: "Section",
	container: "Box",
	grid: "Grid",
	column: "Col",
	stack: "Group",
	heading: "Heading",
	text: "Text",
	button: "Button",
	image: "Image",
};

export function getNodeLabel(type: string): string {
	return NODE_LABELS[type] ?? type;
}

export function getNodeLabelShort(type: string): string {
	return NODE_LABELS_SHORT[type] ?? type;
}

// Mirrors each node's `category` field (@kiv/nodes) — kept as a lookup here
// rather than read from the registry so the tree can color a row without
// threading the registry through every recursive KivTreeNode level.
const NODE_CATEGORY: Record<string, "layout" | "content" | "media"> = {
	page: "layout",
	section: "layout",
	container: "layout",
	stack: "layout",
	grid: "layout",
	column: "layout",
	heading: "content",
	text: "content",
	button: "content",
	link: "content",
	"rich-text": "content",
	divider: "content",
	image: "media",
	video: "media",
	icon: "media",
};

const CATEGORY_TINT: Record<"layout" | "content" | "media", string> = {
	layout: "rgba(148, 163, 184, 0.16)",
	content: "rgba(129, 140, 248, 0.18)",
	media: "rgba(52, 211, 153, 0.16)",
};

export function getNodeCategoryTint(type: string): string {
	const category = NODE_CATEGORY[type] ?? "layout";
	return CATEGORY_TINT[category];
}
