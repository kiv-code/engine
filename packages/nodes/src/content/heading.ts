import { defineNode, f, tokenRef } from "@kiv/engine";

export const headingNode = defineNode({
	type: "heading",
	category: "content",
	fields: {
		text: f.text({ label: "Text", localizable: true, group: "Content" }),
		level: f.select(["1", "2", "3", "4", "5", "6"], {
			label: "Level",
			default: "2",
			group: "Content",
		}),
		color: f.color({
			label: "Color",
			default: tokenRef("colors", "foreground"),
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
