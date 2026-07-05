import { defineNode, f } from "@kiv/engine";

export const textNode = defineNode({
	type: "text",
	category: "content",
	fields: {
		content: f.textarea({
			label: "Content",
			localizable: true,
			inline: true,
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
