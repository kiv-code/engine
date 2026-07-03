import { defineNode, f } from "@kiv/engine";

export const containerNode = defineNode({
	type: "container",
	category: "layout",
	fields: {
		maxWidth: f.select(["sm", "md", "lg", "xl", "2xl", "full"], {
			label: "Max width",
			default: "lg",
			group: "Layout",
		}),
		paddingX: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Padding X",
			default: "md",
			responsive: true,
			group: "Layout",
		}),
		centered: f.boolean({ label: "Centered", default: true, group: "Layout" }),
	},
});
