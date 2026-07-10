import { defineNode, f } from "@kiv/engine";
import { styleToString } from "../html-utils";
import { LETTER_SPACING, LINE_HEIGHT } from "../scales";

export const richTextNode = defineNode({
	type: "rich-text",
	category: "content",
	toHtml(props) {
		const style = styleToString({
			fontSize: `${props.size ?? 16}px`,
			fontWeight: String(props.weight ?? "400"),
			color: String(props.color ?? "inherit"),
			textAlign: String(props.align ?? "left"),
			lineHeight: LINE_HEIGHT[String(props.lineHeight ?? "relaxed")] ?? "1.6",
			letterSpacing:
				LETTER_SPACING[String(props.letterSpacing ?? "normal")] ?? "0em",
			margin: "0",
		});
		const content = props.content ?? "";
		return `<div style="${style}" data-kiv-type="rich-text">${content}</div>`;
	},
	fields: {
		content: f.textarea({
			label: "Content (HTML)",
			localizable: true,
			inline: true,
			placeholder: "<b>Bold</b>, <i>Italic</i>, <a href='#'>Links</a>…",
			group: "Content",
		}),
		size: f.number({
			label: "Size (px)",
			default: 16,
			responsive: true,
			group: "Typography",
		}),
		weight: f.select(["300", "400", "500", "600", "700"], {
			label: "Weight",
			default: "400",
			responsive: true,
			group: "Typography",
		}),
		color: f.color({ label: "Color", default: "#000000", group: "Typography" }),
		align: f.select(["left", "center", "right", "justify"], {
			label: "Align",
			default: "left",
			responsive: true,
			group: "Typography",
		}),
		lineHeight: f.select(["tight", "snug", "normal", "relaxed", "loose"], {
			label: "Line height",
			default: "relaxed",
			group: "Typography",
		}),
		letterSpacing: f.select(["tighter", "tight", "normal", "wide", "wider"], {
			label: "Letter spacing",
			default: "normal",
			group: "Typography",
		}),
	},
});
