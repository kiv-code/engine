import { defineNode, f } from "@kiv/engine";

export const textNode = defineNode({
	type: "text",
	category: "content",
	fields: {
		content: f.textarea({
			label: "Content",
			localizable: true,
			group: "Content",
			inline: true,
		}),
		color: f.color({
			label: "Color",
			default: "#000000",
			group: "Typography",
		}),
		size: f.number({
			label: "Size (px)",
			default: 16,
			group: "Typography",
		}),
		align: f.select(["left", "center", "right"], {
			label: "Align",
			default: "left",
			responsive: true,
			group: "Typography",
		}),
	},
});
