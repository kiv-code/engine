import { defineNode, f } from "@kiv/engine";

export const headingNode = defineNode({
	type: "heading",
	category: "content",
	fields: {
		text: f.text({
			label: "Text",
			localizable: true,
			inline: true,
			group: "Content",
		}),
		level: f.select(["1", "2", "3", "4", "5", "6"], {
			label: "HTML Tag",
			default: "2",
			group: "Typography",
		}),
		size: f.number({
			label: "Size (px)",
			responsive: true,
			group: "Typography",
		}),
		weight: f.select(["300", "400", "500", "600", "700", "800", "900"], {
			label: "Weight",
			default: "700",
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
			default: "normal",
			group: "Typography",
		}),
		letterSpacing: f.select(
			["tighter", "tight", "normal", "wide", "wider", "widest"],
			{
				label: "Letter spacing",
				default: "normal",
				group: "Typography",
			},
		),
		transform: f.select(["none", "uppercase", "lowercase", "capitalize"], {
			label: "Transform",
			default: "none",
			group: "Typography",
		}),
	},
});
