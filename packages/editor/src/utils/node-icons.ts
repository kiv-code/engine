// Icon map for node types — displayed in KivTreeNode
export const NODE_ICONS: Record<string, string> = {
	page: "📄",
	section: "◼",
	container: "⬜",
	grid: "⊞",
	column: "│",
	stack: "⋮",
	heading: "H",
	text: "¶",
	button: "⬡",
	image: "🖼",
};

export function getNodeIcon(type: string): string {
	return NODE_ICONS[type] ?? "◇";
}
