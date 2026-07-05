import { defineNode, f } from "@kiv/engine";

export const buttonNode = defineNode({
	type: "button",
	category: "content",
	fields: {
		label: f.text({
			label: "Label",
			localizable: true,
			inline: true,
			group: "Content",
		}),
		href: f.text({ label: "Href", default: "#", group: "Link" }),
		target: f.select(["_self", "_blank"], {
			label: "Target",
			default: "_self",
			group: "Link",
		}),
		linkType: f.select(["internal", "external", "anchor"], {
			label: "Link type",
			default: "internal",
			group: "Link",
		}),
		variant: f.select(["primary", "secondary", "ghost", "outline", "link"], {
			label: "Variant",
			default: "primary",
			group: "Style",
		}),
		size: f.select(["xs", "sm", "md", "lg", "xl"], {
			label: "Size",
			default: "md",
			responsive: true,
			group: "Style",
		}),
		fullWidth: f.boolean({
			label: "Full width",
			default: false,
			responsive: true,
			group: "Style",
		}),
		align: f.select(["left", "center", "right"], {
			label: "Text align",
			default: "center",
			group: "Style",
		}),
		borderRadius: f.select(["none", "sm", "md", "lg", "xl", "full"], {
			label: "Border radius",
			default: "md",
			group: "Style",
		}),
		fontWeight: f.select(["400", "500", "600", "700"], {
			label: "Font weight",
			default: "600",
			group: "Style",
		}),
	},
});
