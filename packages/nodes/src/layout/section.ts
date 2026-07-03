import { defineNode, f, tokenRef } from "@kiv/engine";

export const sectionNode = defineNode({
	type: "section",
	category: "layout",
	fields: {
		background: f.color({
			label: "Background color",
			default: "transparent",
			responsive: true,
			group: "Background",
		}),
		backgroundImage: f.text({
			label: "Background image URL",
			group: "Background",
		}),
		backgroundVideo: f.text({
			label: "Background video URL",
			group: "Background",
		}),
		backgroundSize: f.select(["cover", "contain", "auto"], {
			label: "Background size",
			default: "cover",
			group: "Background",
		}),
		backgroundPosition: f.select(["center", "top", "bottom", "left", "right"], {
			label: "Background position",
			default: "center",
			group: "Background",
		}),
		gradient: f.text({ label: "Gradient (CSS value)", group: "Background" }),
		overlay: f.boolean({ label: "Overlay", default: false, group: "Overlay" }),
		overlayColor: f.color({
			label: "Overlay color",
			default: "rgba(0,0,0,0.4)",
			group: "Overlay",
		}),
		overlayOpacity: f.number({
			label: "Overlay opacity (0-1)",
			default: 0.4,
			group: "Overlay",
		}),
		blur: f.select(["none", "sm", "md", "lg"], {
			label: "Backdrop blur",
			default: "none",
			group: "Effects",
		}),
		opacity: f.number({ label: "Opacity (0-1)", default: 1, group: "Effects" }),
		paddingY: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Padding Y",
			default: "lg",
			responsive: true,
			group: "Layout",
		}),
		paddingX: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Padding X",
			default: "md",
			responsive: true,
			group: "Layout",
		}),
		marginY: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Margin Y",
			default: "none",
			responsive: true,
			group: "Layout",
		}),
		fullWidth: f.boolean({
			label: "Full width",
			default: true,
			group: "Layout",
		}),
		minHeight: f.text({ label: "Min height (CSS value)", group: "Layout" }),
		borderWidth: f.select(["0", "1", "2", "4"], {
			label: "Border width",
			default: "0",
			group: "Border",
		}),
		borderColor: f.color({
			label: "Border color",
			default: tokenRef("colors", "border"),
			group: "Border",
		}),
		borderRadius: f.select(["none", "sm", "md", "lg", "full"], {
			label: "Border radius",
			default: "none",
			group: "Border",
		}),
		shadow: f.select(["none", "sm", "md", "lg"], {
			label: "Shadow",
			default: "none",
			group: "Border",
		}),
	},
});
