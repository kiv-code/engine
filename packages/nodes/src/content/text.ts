import { defineNode, f, tokenRef } from "@kiv/engine";

export const textNode = defineNode({
	type: "text",
	category: "content",
	fields: {
		content: f.textarea({
			label: "Content",
			localizable: true,
			group: "Content",
		}),
		color: f.color({
			label: "Color",
			default: tokenRef("colors", "foreground"),
			group: "Typography",
		}),
		size: f.select(["sm", "base", "lg", "xl"], {
			label: "Size",
			default: "base",
			responsive: true,
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
