import { defineNode, f } from "@kiv/engine";
import { hoverEffectClass, hoverGlowStyle } from "../hover-effects";
import { escapeHtml, styleToString } from "../html-utils";
import { RADIUS, SHADOW } from "../scales";
import { sizeField } from "../size-field";

const IMAGE_HOVER_OPTIONS = [
	"none",
	"lift",
	"grow",
	"glow",
	"fade",
	"grayscale",
] as const;

export const imageNode = defineNode({
	type: "image",
	category: "media",
	toHtml(props) {
		const style = styleToString({
			objectFit: String(props.fit ?? "cover"),
			aspectRatio:
				props.aspectRatio !== "auto" ? String(props.aspectRatio) : undefined,
			width: String(props.width ?? "100%"),
			maxWidth: "100%",
			display: "block",
			borderRadius: RADIUS[String(props.borderRadius ?? "none")] ?? "0",
			boxShadow: SHADOW[String(props.shadow ?? "none")] ?? "none",
			...hoverGlowStyle(props.hoverGlowColor),
		});
		const hoverClass = hoverEffectClass(props.hoverEffect);
		const classAttr = hoverClass ? ` class="${hoverClass}"` : "";
		const src = escapeHtml(props.src ?? "");
		const alt = escapeHtml(props.alt ?? "");
		return `<img src="${src}" alt="${alt}"${classAttr} style="${style}" data-kiv-type="image" />`;
	},
	fields: {
		src: f.text({ label: "Source URL", group: "Content" }),
		alt: f.text({ label: "Alt text", localizable: true, group: "Content" }),
		fit: f.select(["cover", "contain", "fill", "none"], {
			label: "Object fit",
			default: "cover",
			group: "Style",
		}),
		aspectRatio: f.select(
			["auto", "1/1", "4/3", "3/2", "16/9", "21/9", "9/16"],
			{
				label: "Aspect ratio",
				default: "auto",
				group: "Style",
			},
		),
		width: sizeField({
			label: "Width",
			default: "100%",
			group: "Style",
			hint: "Any percentage or pixel value — drag the slider or type an exact size.",
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
		hoverEffect: f.select([...IMAGE_HOVER_OPTIONS], {
			label: "Hover effect",
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
