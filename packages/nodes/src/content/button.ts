import { defineNode, f } from "@kiv/engine";

export const buttonNode = defineNode({
	type: "button",
	category: "content",
	fields: {
		label: f.text({
			label: "Label",
			localizable: true,
			group: "Content",
			inline: true,
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
		variant: f.select(["primary", "secondary", "ghost", "outline"], {
			label: "Variant",
			default: "primary",
			group: "Style",
		}),
		size: f.select(["sm", "md", "lg"], {
			label: "Size",
			default: "md",
			group: "Style",
		}),
		fullWidth: f.boolean({
			label: "Full width",
			default: false,
			responsive: true,
			group: "Style",
		}),
	},
});
