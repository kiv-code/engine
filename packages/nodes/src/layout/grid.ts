import { defineNode, f } from "@kiv/engine";

export const gridNode = defineNode({
	type: "grid",
	category: "layout",
	fields: {
		columns: f.select(["1", "2", "3", "4", "6", "12"], {
			label: "Columns",
			default: "12",
			responsive: true,
			group: "Layout",
		}),
		gap: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Gap",
			default: "md",
			responsive: true,
			group: "Layout",
		}),
		rowGap: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Row gap",
			default: "md",
			responsive: true,
			group: "Layout",
		}),
		alignItems: f.select(["start", "center", "end", "stretch"], {
			label: "Align items",
			default: "stretch",
			group: "Layout",
		}),
	},
});
