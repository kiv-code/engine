import { defineNode, f } from "@kiv/engine";

export const stackNode = defineNode({
	type: "stack",
	category: "layout",
	fields: {
		direction: f.select(["vertical", "horizontal"], {
			label: "Direction",
			default: "vertical",
			responsive: true,
			group: "Layout",
		}),
		gap: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Gap",
			default: "md",
			responsive: true,
			group: "Layout",
		}),
		align: f.select(["start", "center", "end", "stretch"], {
			label: "Align items",
			default: "start",
			responsive: true,
			group: "Layout",
		}),
		justify: f.select(["start", "center", "end", "between", "around"], {
			label: "Justify content",
			default: "start",
			responsive: true,
			group: "Layout",
		}),
		wrap: f.boolean({ label: "Wrap", default: false, group: "Layout" }),
	},
});
