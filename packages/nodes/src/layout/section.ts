import { defineNode, f } from "@kiv/engine";
import { escapeHtml, styleToString } from "../html-utils";
import { BLUR, RADIUS, SECTION_SPACING, SHADOW } from "../scales";

export const sectionNode = defineNode({
	type: "section",
	category: "layout",
	toHtml(props, children) {
		const s: Record<string, string | undefined> = {
			position: "relative",
			width: "100%",
			display: "flex",
			flexDirection: "column",
		};
		if (props.background && props.background !== "transparent") {
			s.backgroundColor = String(props.background);
		}
		if (props.backgroundImage) {
			s.backgroundImage = `url(${props.backgroundImage})`;
			s.backgroundSize = String(props.backgroundSize ?? "cover");
			s.backgroundPosition = String(props.backgroundPosition ?? "center");
		}
		if (props.gradient) s.backgroundImage = String(props.gradient);
		if (props.opacity !== undefined && props.opacity !== 1) {
			s.opacity = String(props.opacity);
		}
		if (props.paddingY && props.paddingY !== "none") {
			const v =
				SECTION_SPACING[String(props.paddingY)] ?? String(props.paddingY);
			s.paddingTop = v;
			s.paddingBottom = v;
		}
		if (props.paddingX && props.paddingX !== "none") {
			const v =
				SECTION_SPACING[String(props.paddingX)] ?? String(props.paddingX);
			s.paddingLeft = v;
			s.paddingRight = v;
		}
		if (props.marginY && props.marginY !== "none") {
			const v = SECTION_SPACING[String(props.marginY)] ?? String(props.marginY);
			s.marginTop = v;
			s.marginBottom = v;
		}
		if (props.borderWidth && props.borderWidth !== "0") {
			s.borderWidth = `${props.borderWidth}px`;
			s.borderStyle = "solid";
			if (props.borderColor) s.borderColor = String(props.borderColor);
		}
		if (props.borderRadius && props.borderRadius !== "none") {
			s.borderRadius =
				RADIUS[String(props.borderRadius)] ?? String(props.borderRadius);
		}
		if (props.shadow && props.shadow !== "none") {
			s.boxShadow = SHADOW[String(props.shadow)] ?? String(props.shadow);
		}
		if (props.minHeight) s.minHeight = String(props.minHeight);

		let videoHtml = "";
		if (props.backgroundVideo) {
			const videoWrapStyle = styleToString({
				position: "absolute",
				inset: "0",
				overflow: "hidden",
				pointerEvents: "none",
			});
			videoHtml = `<div class="kiv-section__video-bg" style="${videoWrapStyle}"><video autoplay muted loop playsinline src="${escapeHtml(props.backgroundVideo)}" style="width: 100%; height: 100%; object-fit: cover;"></video></div>`;
		}

		let blurHtml = "";
		const blurAmount = BLUR[String(props.blur ?? "none")] ?? "0";
		if (blurAmount !== "0") {
			const blurStyle = styleToString({
				position: "absolute",
				inset: "0",
				backdropFilter: `blur(${blurAmount})`,
				pointerEvents: "none",
				zIndex: "0",
			});
			blurHtml = `<div style="${blurStyle}"></div>`;
		}

		let overlayHtml = "";
		if (props.overlay) {
			const overlayStyle = styleToString({
				position: "absolute",
				inset: "0",
				pointerEvents: "none",
				background: String(props.overlayColor ?? "rgba(0,0,0,0.4)"),
				opacity: String(props.overlayOpacity ?? 0.4),
			});
			overlayHtml = `<div class="kiv-section__overlay" style="${overlayStyle}"></div>`;
		}

		const contentStyle = styleToString({
			position: "relative",
			zIndex: "1",
			display: "flex",
			flexDirection: "column",
			width: "100%",
			flex: "1",
			alignItems:
				props.alignItems && props.alignItems !== "flex-start"
					? String(props.alignItems)
					: undefined,
			justifyContent:
				props.justifyContent && props.justifyContent !== "flex-start"
					? String(props.justifyContent)
					: undefined,
		});

		return `<section style="${styleToString(s)}" data-kiv-type="section" class="kiv-section">${videoHtml}${blurHtml}${overlayHtml}<div class="kiv-section__content" style="${contentStyle}">${children.default ?? ""}</div></section>`;
	},
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
