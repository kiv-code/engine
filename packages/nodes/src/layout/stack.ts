import { defineNode, f } from "@kiv/engine";

export const stackNode = defineNode({
	type: "stack",
	category: "layout",
	fields: {
		direction: f.select(["column", "row"], {
			label: "Direction",
			default: "column",
			responsive: true,
			group: "Layout",
		}),
		gap: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Gap",
			default: "md",
			responsive: true,
			group: "Layout",
		}),
		align: f.select(
			["flex-start", "center", "flex-end", "stretch", "baseline"],
			{
				label: "Align items",
				default: "flex-start",
				responsive: true,
				group: "Layout",
			},
		),
		justify: f.select(
			[
				"flex-start",
				"center",
				"flex-end",
				"space-between",
				"space-around",
				"space-evenly",
			],
			{
				label: "Justify content",
				default: "flex-start",
				responsive: true,
				group: "Layout",
			},
		),
		wrap: f.boolean({
			label: "Wrap",
			default: false,
			responsive: true,
			group: "Layout",
		}),
		paddingY: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Padding Y",
			default: "none",
			responsive: true,
			group: "Spacing",
		}),
		paddingX: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Padding X",
			default: "none",
			responsive: true,
			group: "Spacing",
		}),
		background: f.color({
			label: "Background",
			default: "transparent",
			group: "Style",
		}),
		borderRadius: f.select(["none", "sm", "md", "lg", "xl", "full"], {
			label: "Border radius",
			default: "none",
			group: "Style",
		}),
		shadow: f.select(["none", "sm", "md", "lg"], {
			label: "Shadow",
			default: "none",
			group: "Style",
		}),
	},
});
