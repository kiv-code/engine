import { defineNode, f } from "@kiv/engine";

export const headingNode = defineNode({
	type: "heading",
	category: "content",
	fields: {
		text: f.text({
			label: "Text",
			localizable: true,
			group: "Content",
			inline: true,
		}),
		level: f.select(["1", "2", "3", "4", "5", "6"], {
			label: "HTML tag (H1–H6)",
			default: "2",
			group: "Typography",
		}),
		size: f.number({
			label: "Size (px)",
			group: "Typography",
		}),
		color: f.color({
			label: "Color",
			default: "#000000",
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
