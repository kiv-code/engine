import { defineNode, f } from "@kiv/engine";
import {
	colorOrGradientField,
	resolveBackgroundPaint,
} from "../color-gradient";
import { hoverEffectClass, hoverGlowStyle } from "../hover-effects";
import { styleToString } from "../html-utils";
import { RADIUS, SHADOW, SPACING } from "../scales";

export const cardNode = defineNode({
	type: "card",
	category: "content",
	label: "Card",
	icon: "square",
	slotConstraints: {
		default: ["heading", "text", "button", "icon", "image", "stack", "divider"],
	},
	toHtml(props, children) {
		const style = styleToString({
			background: resolveBackgroundPaint(props.background, "#ffffff"),
			borderRadius: RADIUS[String(props.borderRadius ?? "lg")] ?? "16px",
			padding: SPACING[String(props.padding ?? "lg")] ?? "32px",
			boxShadow: SHADOW[String(props.shadow ?? "md")] ?? "none",
			borderWidth: props.borderWidth ? `${props.borderWidth}px` : undefined,
			borderStyle: props.borderWidth ? "solid" : undefined,
			borderColor: props.borderWidth
				? String(props.borderColor ?? "#e2e8f0")
				: undefined,
			outline: props.highlighted ? "2px solid #6366f1" : undefined,
			outlineOffset: props.highlighted ? "2px" : undefined,
			...hoverGlowStyle(props.hoverGlowColor),
		});
		const hoverClass = hoverEffectClass(props.hoverEffect);
		const classAttr = hoverClass ? ` class="${hoverClass}"` : "";
		return `<div style="${style}"${classAttr} data-kiv-type="card">${children.default ?? ""}</div>`;
	},
	fields: {
		background: colorOrGradientField({ label: "Background", group: "Style" }),
		borderRadius: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Border Radius",
			default: "lg",
			group: "Style",
		}),
		padding: f.select(["sm", "md", "lg", "xl"], {
			label: "Padding",
			default: "lg",
			group: "Style",
		}),
		shadow: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Shadow",
			default: "md",
			group: "Style",
		}),
		borderWidth: f.number({
			label: "Border Width",
			default: 0,
			group: "Style",
		}),
		borderColor: f.color({
			label: "Border Color",
			default: "#e2e8f0",
			group: "Style",
		}),
		highlighted: f.boolean({
			label: "Highlighted (featured)",
			default: false,
			group: "Style",
		}),
		hoverEffect: f.select(["none", "lift", "grow", "glow"], {
			label: "Hover Effect",
			default: "none",
			group: "Effects",
		}),
		hoverGlowColor: f.color({
			label: "Glow color",
			default: "",
			hint: "Empty uses the default indigo glow.",
			showIf: { field: "hoverEffect", equals: "glow" },
			group: "Effects",
		}),
	},
});
