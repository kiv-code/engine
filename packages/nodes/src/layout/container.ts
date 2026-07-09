import { defineNode, f } from "@kiv/engine";
import { styleToString } from "../html-utils";
import { MAX_WIDTH, SPACING } from "../scales";

export const containerNode = defineNode({
	type: "container",
	category: "layout",
	toHtml(props, children) {
		const style = styleToString({
			maxWidth: MAX_WIDTH[String(props.maxWidth ?? "lg")] ?? "1024px",
			marginLeft: props.centered !== false ? "auto" : undefined,
			marginRight: props.centered !== false ? "auto" : undefined,
			paddingLeft: SPACING[String(props.paddingX ?? "md")] ?? "16px",
			paddingRight: SPACING[String(props.paddingX ?? "md")] ?? "16px",
			paddingTop: SPACING[String(props.paddingY ?? "none")] ?? "0",
			paddingBottom: SPACING[String(props.paddingY ?? "none")] ?? "0",
			width: "100%",
		});
		return `<div style="${style}" data-kiv-type="container">${children.default ?? ""}</div>`;
	},
	fields: {
		maxWidth: f.select(["xs", "sm", "md", "lg", "xl", "2xl", "full"], {
			label: "Max width",
			default: "lg",
			group: "Layout",
		}),
		paddingX: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Padding X",
			default: "md",
			responsive: true,
			group: "Layout",
		}),
		paddingY: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Padding Y",
			default: "none",
			responsive: true,
			group: "Layout",
		}),
		centered: f.boolean({ label: "Centered", default: true, group: "Layout" }),
	},
});
