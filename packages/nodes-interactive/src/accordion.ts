import { defineNode, f } from "@kiv/engine";
import { escapeHtml, GAP, RADIUS, styleToString } from "@kiv/nodes";

export const accordionNode = defineNode({
	type: "accordion",
	category: "interactive",
	label: "Accordion",
	icon: "chevrons-down-up",
	description: "Collapsible list of titled panels.",
	slotConstraints: { default: ["accordion-item"] },
	toHtml(props, children) {
		const style = styleToString({
			display: "flex",
			flexDirection: "column",
			gap: GAP[String(props.gap ?? "sm")] ?? "8px",
		});
		return `<div data-kiv-type="accordion" style="${style}">${children.default ?? ""}</div>`;
	},
	fields: {
		allowMultiple: f.boolean({
			label: "Allow Multiple Open",
			default: false,
			group: "Behavior",
		}),
		keepOneOpen: f.boolean({
			label: "Keep One Open",
			default: true,
			group: "Behavior",
		}),
		defaultOpenIndex: f.number({
			label: "Default Open Index",
			default: 0,
			group: "Behavior",
		}),
		animation: f.select(["slide", "fade", "none"], {
			label: "Animation",
			default: "slide",
			group: "Style",
		}),
		animationDuration: f.number({
			label: "Duration (ms)",
			default: 200,
			group: "Style",
		}),
		icon: f.select(["chevron", "plus", "arrow"], {
			label: "Expand Icon",
			default: "chevron",
			group: "Style",
		}),
		iconPosition: f.select(["left", "right"], {
			label: "Icon Position",
			default: "right",
			group: "Style",
		}),
		gap: f.select(["none", "xs", "sm", "md", "lg"], {
			label: "Gap Between Items",
			default: "sm",
			group: "Layout",
		}),
		borderRadius: f.select(["none", "sm", "md", "lg"], {
			label: "Border Radius",
			default: "md",
			group: "Style",
		}),
	},
});

export const accordionItemNode = defineNode({
	type: "accordion-item",
	category: "interactive",
	label: "Accordion Item",
	icon: "chevron-right",
	description: "A single titled, collapsible panel inside an Accordion.",
	toHtml(props, children) {
		const background =
			props.background && props.background !== "transparent"
				? String(props.background)
				: undefined;
		const wrapStyle = styleToString({
			background,
			borderRadius: RADIUS.sm ?? "4px",
			overflow: "hidden",
		});
		const summaryStyle = styleToString({
			cursor: props.disabled ? "not-allowed" : "pointer",
			color: props.titleColor ? String(props.titleColor) : undefined,
			fontWeight: "600",
			padding: "12px 16px",
			opacity: props.disabled ? "0.5" : undefined,
		});
		const bodyStyle = styleToString({ padding: "0 16px 16px" });
		const title = props.title !== undefined ? escapeHtml(props.title) : "";
		const openAttr = props.defaultOpen ? " open" : "";
		const disabledAttr = props.disabled ? ' aria-disabled="true"' : "";
		// <details>/<summary> is a real, no-JS accordion — the Vue renderer
		// owns richer runtime state (multi-open, icons, animation), but the
		// static export stays genuinely collapsible without any script.
		return (
			`<details data-kiv-type="accordion-item" style="${wrapStyle}"${openAttr}${disabledAttr}>` +
			`<summary style="${summaryStyle}">${title}</summary>` +
			`<div style="${bodyStyle}">${children.default ?? ""}</div>` +
			`</details>`
		);
	},
	fields: {
		title: f.text({
			label: "Title",
			localizable: true,
			inline: true,
			group: "Content",
		}),
		defaultOpen: f.boolean({
			label: "Open by Default",
			default: false,
			group: "Behavior",
		}),
		disabled: f.boolean({
			label: "Disabled",
			default: false,
			group: "Behavior",
		}),
		icon: f.text({ label: "Custom Icon", default: "", group: "Style" }),
		background: f.color({
			label: "Background",
			default: "transparent",
			group: "Style",
		}),
		titleColor: f.color({ label: "Title Color", default: "", group: "Style" }),
	},
});
