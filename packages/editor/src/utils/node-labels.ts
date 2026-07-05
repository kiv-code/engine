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
