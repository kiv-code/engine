import { defineNode, f } from "@kiv/engine";
import { styleToString } from "../html-utils";
import { GAP } from "../scales";

export const gridNode = defineNode({
	type: "grid",
	category: "layout",
	toHtml(props, children) {
		const style = styleToString({
			display: "grid",
			gridTemplateColumns: `repeat(${props.columns ?? "1"}, minmax(0, 1fr))`,
			columnGap: GAP[String(props.gap ?? "md")] ?? "16px",
			rowGap: GAP[String(props.rowGap ?? "md")] ?? "16px",
			alignItems: String(props.alignItems ?? "stretch"),
		});
		return `<div style="${style}" data-kiv-type="grid">${children.default ?? ""}</div>`;
	},
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
