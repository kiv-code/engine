import { defineNode, f } from "@kiv/engine";

export const imageNode = defineNode({
	type: "image",
	category: "media",
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
		width: f.select(["auto", "25%", "33%", "50%", "66%", "75%", "100%"], {
			label: "Width",
			default: "100%",
			responsive: true,
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
	},
});
