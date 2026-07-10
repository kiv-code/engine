import { defineNode, f } from "@kiv/engine";
import { styleToString } from "../html-utils";
import { GAP, RADIUS, SHADOW, SPACING } from "../scales";

/** A per-side override (e.g. paddingTop) wins over the Y/X shorthand when set; empty falls back to it. */
function side(
	override: unknown,
	shorthand: unknown,
	scale: Record<string, string>,
): string {
	const raw = typeof override === "string" ? override.trim() : "";
	if (raw) return raw;
	return scale[String(shorthand ?? "none")] ?? "0";
}

export const stackNode = defineNode({
	type: "stack",
	category: "layout",
	toHtml(props, children) {
		const borderWidths = {
			top: Number(props.borderTopWidth ?? 0),
			right: Number(props.borderRightWidth ?? 0),
			bottom: Number(props.borderBottomWidth ?? 0),
			left: Number(props.borderLeftWidth ?? 0),
		};
		const hasBorder = Object.values(borderWidths).some((w) => w > 0);
		const borderStyle = String(props.borderStyle ?? "solid");
		const borderColor = String(props.borderColor ?? "#e2e8f0");

		const style = styleToString({
			display: "flex",
			flexDirection: props.direction === "row" ? "row" : "column",
			gap: GAP[String(props.gap ?? "md")] ?? "16px",
			alignItems: String(props.align ?? "flex-start"),
			justifyContent: String(props.justify ?? "flex-start"),
			flexWrap: props.wrap ? "wrap" : "nowrap",
			paddingTop: side(props.paddingTop, props.paddingY, SPACING),
			paddingRight: side(props.paddingRight, props.paddingX, SPACING),
			paddingBottom: side(props.paddingBottom, props.paddingY, SPACING),
			paddingLeft: side(props.paddingLeft, props.paddingX, SPACING),
			marginTop: side(props.marginTop, props.marginY, SPACING),
			marginRight: side(props.marginRight, props.marginX, SPACING),
			marginBottom: side(props.marginBottom, props.marginY, SPACING),
			marginLeft: side(props.marginLeft, props.marginX, SPACING),
			background:
				props.background && props.background !== "transparent"
					? String(props.background)
					: undefined,
			borderRadius: RADIUS[String(props.borderRadius ?? "none")] ?? "0",
			boxShadow: SHADOW[String(props.shadow ?? "none")] ?? "none",
			borderTop: borderWidths.top
				? `${borderWidths.top}px ${borderStyle} ${borderColor}`
				: undefined,
			borderRight: borderWidths.right
				? `${borderWidths.right}px ${borderStyle} ${borderColor}`
				: undefined,
			borderBottom: borderWidths.bottom
				? `${borderWidths.bottom}px ${borderStyle} ${borderColor}`
				: undefined,
			borderLeft: borderWidths.left
				? `${borderWidths.left}px ${borderStyle} ${borderColor}`
				: undefined,
			boxSizing: hasBorder ? "border-box" : undefined,
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
		// Quick shorthand — sets all four sides at once via the spacing scale.
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
		marginY: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Margin Y",
			default: "none",
			responsive: true,
			group: "Spacing",
		}),
		marginX: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Margin X",
			default: "none",
			responsive: true,
			group: "Spacing",
		}),
		// Independent per-side overrides — any CSS length (e.g. "12px", "2rem").
		// Empty means "use the Y/X shorthand above for this side".
		paddingTop: f.text({
			label: "Padding top",
			default: "",
			hint: "Overrides Padding Y for this side. Any CSS length.",
			group: "Spacing (advanced)",
		}),
		paddingRight: f.text({
			label: "Padding right",
			default: "",
			hint: "Overrides Padding X for this side. Any CSS length.",
			group: "Spacing (advanced)",
		}),
		paddingBottom: f.text({
			label: "Padding bottom",
			default: "",
			hint: "Overrides Padding Y for this side. Any CSS length.",
			group: "Spacing (advanced)",
		}),
		paddingLeft: f.text({
			label: "Padding left",
			default: "",
			hint: "Overrides Padding X for this side. Any CSS length.",
			group: "Spacing (advanced)",
		}),
		marginTop: f.text({
			label: "Margin top",
			default: "",
			hint: "Overrides Margin Y for this side. Any CSS length.",
			group: "Spacing (advanced)",
		}),
		marginRight: f.text({
			label: "Margin right",
			default: "",
			hint: "Overrides Margin X for this side. Any CSS length.",
			group: "Spacing (advanced)",
		}),
		marginBottom: f.text({
			label: "Margin bottom",
			default: "",
			hint: "Overrides Margin Y for this side. Any CSS length.",
			group: "Spacing (advanced)",
		}),
		marginLeft: f.text({
			label: "Margin left",
			default: "",
			hint: "Overrides Margin X for this side. Any CSS length.",
			group: "Spacing (advanced)",
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
		// Independent per-side border widths (0 = no border on that side), a
		// shared style + color for whichever sides are enabled.
		borderTopWidth: f.number({
			label: "Border top (px)",
			default: 0,
			group: "Border",
		}),
		borderRightWidth: f.number({
			label: "Border right (px)",
			default: 0,
			group: "Border",
		}),
		borderBottomWidth: f.number({
			label: "Border bottom (px)",
			default: 0,
			group: "Border",
		}),
		borderLeftWidth: f.number({
			label: "Border left (px)",
			default: 0,
			group: "Border",
		}),
		borderStyle: f.select(["solid", "dashed", "dotted", "double"], {
			label: "Border style",
			default: "solid",
			group: "Border",
		}),
		borderColor: f.color({
			label: "Border color",
			default: "#e2e8f0",
			group: "Border",
		}),
	},
});
