import { defineNode, f } from "@kiv/engine";

export const columnNode = defineNode({
	type: "column",
	category: "layout",
	fields: {
		span: f.select(
			["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "auto"],
			{
				label: "Span",
				default: "auto",
				responsive: true,
				group: "Layout",
			},
		),
		offset: f.select(
			["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
			{
				label: "Offset",
				default: "0",
				responsive: true,
				group: "Layout",
			},
		),
		alignSelf: f.select(
			["auto", "flex-start", "center", "flex-end", "stretch"],
			{
				label: "Align self",
				default: "auto",
				responsive: true,
				group: "Layout",
			},
		),
		paddingX: f.select(["none", "xs", "sm", "md", "lg"], {
			label: "Padding X",
			default: "none",
			responsive: true,
			group: "Spacing",
		}),
		paddingY: f.select(["none", "xs", "sm", "md", "lg"], {
			label: "Padding Y",
			default: "none",
			responsive: true,
			group: "Spacing",
		}),
	},
});
