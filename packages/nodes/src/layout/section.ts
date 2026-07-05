import { defineNode, f } from "@kiv/engine";

export const sectionNode = defineNode({
	type: "section",
	category: "layout",
	fields: {
		// Background
		background: f.color({
			label: "Background color",
			default: "transparent",
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
		gradient: f.text({ label: "Gradient (CSS)", group: "Background" }),
		// Overlay
		overlay: f.boolean({
			label: "Enable overlay",
			default: false,
			group: "Overlay",
		}),
		overlayColor: f.color({
			label: "Overlay color",
			default: "rgba(0,0,0,0.4)",
			group: "Overlay",
		}),
		overlayOpacity: f.number({
			label: "Overlay opacity (0–1)",
			default: 0.4,
			group: "Overlay",
		}),
		// Effects
		blur: f.select(["none", "sm", "md", "lg"], {
			label: "Backdrop blur",
			default: "none",
			group: "Effects",
		}),
		opacity: f.number({ label: "Opacity (0–1)", default: 1, group: "Effects" }),
		// Layout
		fullWidth: f.boolean({
			label: "Full width",
			default: true,
			group: "Layout",
		}),
		minHeight: f.text({ label: "Min height (CSS)", group: "Layout" }),
		paddingY: f.select(["none", "xs", "sm", "md", "lg", "xl", "2xl"], {
			label: "Padding Y",
			default: "lg",
			responsive: true,
			group: "Layout",
		}),
		paddingX: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Padding X",
			default: "none",
			responsive: true,
			group: "Layout",
		}),
		marginY: f.select(["none", "xs", "sm", "md", "lg", "xl"], {
			label: "Margin Y",
			default: "none",
			responsive: true,
			group: "Layout",
		}),
		alignItems: f.select(["flex-start", "center", "flex-end", "stretch"], {
			label: "Align horizontal",
			default: "flex-start",
			responsive: true,
			group: "Layout",
		}),
		justifyContent: f.select(
			["flex-start", "center", "flex-end", "space-between", "space-around"],
			{
				label: "Align vertical",
				default: "flex-start",
				responsive: true,
				group: "Layout",
			},
		),
		// Border
		borderWidth: f.select(["0", "1", "2", "4"], {
			label: "Border width",
			default: "0",
			group: "Border",
		}),
		borderColor: f.color({
			label: "Border color",
			default: "#e2e8f0",
			group: "Border",
		}),
		borderRadius: f.select(["none", "sm", "md", "lg", "xl", "full"], {
			label: "Border radius",
			default: "none",
			group: "Border",
		}),
		shadow: f.select(["none", "sm", "md", "lg", "xl"], {
			label: "Shadow",
			default: "none",
			group: "Border",
		}),
	},
});
