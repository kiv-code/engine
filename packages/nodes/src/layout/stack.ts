import { defineNode, f } from "@kiv/engine";
import { styleToString } from "../html-utils";
import { GAP, RADIUS, SHADOW, SPACING } from "../scales";

export const stackNode = defineNode({
	type: "stack",
	category: "layout",
	toHtml(props, children) {
		const style = styleToString({
			display: "flex",
			flexDirection: props.direction === "row" ? "row" : "column",
			gap: GAP[String(props.gap ?? "md")] ?? "16px",
			alignItems: String(props.align ?? "flex-start"),
			justifyContent: String(props.justify ?? "flex-start"),
			flexWrap: props.wrap ? "wrap" : "nowrap",
			paddingTop: SPACING[String(props.paddingY ?? "none")] ?? "0",
			paddingBottom: SPACING[String(props.paddingY ?? "none")] ?? "0",
			paddingLeft: SPACING[String(props.paddingX ?? "none")] ?? "0",
			paddingRight: SPACING[String(props.paddingX ?? "none")] ?? "0",
			background:
				props.background && props.background !== "transparent"
					? String(props.background)
					: undefined,
			borderRadius: RADIUS[String(props.borderRadius ?? "none")] ?? "0",
			boxShadow: SHADOW[String(props.shadow ?? "none")] ?? "none",
		});
		return `<div style="${style}" data-kiv-type="stack">${children.default ?? ""}</div>`;
	},
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
