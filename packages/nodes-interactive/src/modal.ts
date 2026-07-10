import { defineNode, f } from "@kiv/engine";
import { escapeHtml, styleToString } from "@kiv/nodes";

export const modalNode = defineNode({
	type: "modal",
	category: "interactive",
	label: "Modal",
	icon: "window",
	description: "A trigger that opens content in an overlay dialog.",
	toHtml(props, children) {
		const triggerLabel =
			props.triggerLabel !== undefined
				? escapeHtml(props.triggerLabel)
				: "Open";
		// No-JS fallback: the trigger can't toggle anything without a script, so
		// it renders inert and the content stays in the DOM (not visually
		// hidden) — the text is still present for SEO/crawlers.
		const trigger = `<button type="button" disabled data-kiv-modal-trigger style="${styleToString(
			{ cursor: "default" },
		)}">${triggerLabel}</button>`;
		const content = `<div data-kiv-modal-content>${children.default ?? ""}</div>`;
		return `<div data-kiv-type="modal">${trigger}${content}</div>`;
	},
	fields: {
		triggerType: f.select(["button", "link", "image", "text"], {
			label: "Trigger Type",
			default: "button",
			group: "Trigger",
		}),
		triggerLabel: f.text({
			label: "Trigger Label",
			localizable: true,
			default: "Open",
			group: "Trigger",
		}),
		triggerStyle: f.select(
			["primary", "secondary", "outline", "ghost", "link"],
			{
				label: "Trigger Style",
				default: "primary",
				group: "Trigger",
			},
		),
		size: f.select(["sm", "md", "lg", "xl", "full", "auto"], {
			label: "Size",
			default: "md",
			group: "Layout",
		}),
		closeOnOverlay: f.boolean({
			label: "Close on Overlay Click",
			default: true,
			group: "Behavior",
		}),
		closeOnEscape: f.boolean({
			label: "Close on Escape",
			default: true,
			group: "Behavior",
		}),
		showCloseButton: f.boolean({
			label: "Show Close Button",
			default: true,
			group: "Controls",
		}),
		preventScroll: f.boolean({
			label: "Prevent Background Scroll",
			default: true,
			group: "Behavior",
		}),
		animation: f.select(["fade", "slide-up", "slide-down", "zoom", "none"], {
			label: "Animation",
			default: "fade",
			group: "Style",
		}),
	},
});
