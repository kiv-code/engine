import { defineNode, f } from "@kiv/engine";
import { escapeHtml, GAP, styleToString } from "@kiv/nodes";

export const tabsNode = defineNode({
	type: "tabs",
	category: "interactive",
	label: "Tabs",
	icon: "folder-tab",
	description: "Switchable set of titled panels.",
	slotConstraints: { default: ["tab-panel"] },
	toHtml(props, children) {
		const style = styleToString({
			display: "flex",
			flexDirection: props.orientation === "vertical" ? "row" : "column",
			gap: GAP.md ?? "16px",
		});
		// No-JS fallback: every panel's content stays present (stacked) so it
		// remains crawlable/readable — only the Vue renderer switches panels.
		return `<div data-kiv-type="tabs" style="${style}">${children.default ?? ""}</div>`;
	},
	fields: {
		defaultTab: f.number({
			label: "Default Tab Index",
			default: 0,
			group: "Behavior",
		}),
		orientation: f.select(["horizontal", "vertical"], {
			label: "Orientation",
			default: "horizontal",
			group: "Layout",
		}),
		position: f.select(["top", "left", "right"], {
			label: "Tab Position",
			default: "top",
			group: "Layout",
		}),
		style: f.select(["underline", "pills", "buttons"], {
			label: "Tab Style",
			default: "underline",
			group: "Style",
		}),
		animation: f.select(["fade", "slide", "none"], {
			label: "Animation",
			default: "fade",
			group: "Style",
		}),
		stretch: f.boolean({
			label: "Stretch Tabs",
			default: false,
			group: "Layout",
		}),
		fullWidth: f.boolean({
			label: "Full Width",
			default: false,
			responsive: true,
			group: "Layout",
		}),
	},
});

export const tabPanelNode = defineNode({
	type: "tab-panel",
	category: "interactive",
	label: "Tab Panel",
	icon: "file-text",
	description: "A single panel of content inside Tabs.",
	toHtml(props, children) {
		const title = props.title !== undefined ? escapeHtml(props.title) : "";
		const badgeStyle = styleToString({
			marginLeft: "8px",
			fontSize: "12px",
			color: props.badgeColor ? String(props.badgeColor) : undefined,
		});
		const badge =
			props.badge !== undefined && props.badge !== ""
				? `<span style="${badgeStyle}">${escapeHtml(props.badge)}</span>`
				: "";
		const header = title
			? `<div style="${styleToString({ fontWeight: "600", marginBottom: "8px" })}">${title}${badge}</div>`
			: "";
		return `<section data-kiv-type="tab-panel">${header}${children.default ?? ""}</section>`;
	},
	fields: {
		title: f.text({
			label: "Tab Title",
			localizable: true,
			inline: true,
			group: "Content",
		}),
		icon: f.text({ label: "Tab Icon", default: "", group: "Style" }),
		badge: f.text({ label: "Badge", default: "", group: "Content" }),
		badgeColor: f.color({
			label: "Badge Color",
			default: "",
			group: "Content",
		}),
		disabled: f.boolean({
			label: "Disabled",
			default: false,
			group: "Behavior",
		}),
	},
});
