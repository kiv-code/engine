<script setup lang="ts">
import { GAP, RADIUS, SHADOW, SPACING } from "@kiv/nodes";
import { computed } from "vue";

const props = defineProps<{
	direction?: string;
	gap?: string;
	align?: string;
	justify?: string;
	wrap?: boolean;
	paddingY?: string;
	paddingX?: string;
	marginY?: string;
	marginX?: string;
	paddingTop?: string;
	paddingRight?: string;
	paddingBottom?: string;
	paddingLeft?: string;
	marginTop?: string;
	marginRight?: string;
	marginBottom?: string;
	marginLeft?: string;
	background?: string;
	borderRadius?: string;
	shadow?: string;
	borderTopWidth?: number;
	borderRightWidth?: number;
	borderBottomWidth?: number;
	borderLeftWidth?: number;
	borderStyle?: string;
	borderColor?: string;
}>();

/** A per-side override wins over the Y/X shorthand when set; empty falls back to it. */
function side(
	override: string | undefined,
	shorthand: string | undefined,
	scale: Record<string, string>,
): string {
	const raw = override?.trim();
	if (raw) return raw;
	return scale[shorthand ?? "none"] ?? "0";
}

const stackStyle = computed(() => {
	const borderWidths = {
		top: props.borderTopWidth ?? 0,
		right: props.borderRightWidth ?? 0,
		bottom: props.borderBottomWidth ?? 0,
		left: props.borderLeftWidth ?? 0,
	};
	const hasBorder = Object.values(borderWidths).some((w) => w > 0);
	const borderStyle = props.borderStyle ?? "solid";
	const borderColor = props.borderColor ?? "#e2e8f0";

	return {
		display: "flex" as const,
		flexDirection: (props.direction === "row" ? "row" : "column") as
			| "row"
			| "column",
		gap: GAP[props.gap ?? "md"] ?? "16px",
		alignItems: props.align ?? "flex-start",
		justifyContent: props.justify ?? "flex-start",
		flexWrap: (props.wrap ? "wrap" : "nowrap") as "wrap" | "nowrap",
		paddingTop: side(props.paddingTop, props.paddingY, SPACING),
		paddingRight: side(props.paddingRight, props.paddingX, SPACING),
		paddingBottom: side(props.paddingBottom, props.paddingY, SPACING),
		paddingLeft: side(props.paddingLeft, props.paddingX, SPACING),
		marginTop: side(props.marginTop, props.marginY, SPACING),
		marginRight: side(props.marginRight, props.marginX, SPACING),
		marginBottom: side(props.marginBottom, props.marginY, SPACING),
		marginLeft: side(props.marginLeft, props.marginX, SPACING),
		background:
			props.background && props.background !== "transparent"
				? props.background
				: undefined,
		borderRadius: RADIUS[props.borderRadius ?? "none"] ?? "0",
		boxShadow: SHADOW[props.shadow ?? "none"] ?? "none",
		borderTop: borderWidths.top
			? `${borderWidths.top}px ${borderStyle} ${borderColor}`
			: undefined,
		borderRight: borderWidths.right
			? `${borderWidths.right}px ${borderStyle} ${borderColor}`
			: undefined,
		borderBottom: borderWidths.bottom
			? `${borderWidths.bottom}px ${borderStyle} ${borderColor}`
			: undefined,
		borderLeft: borderWidths.left
			? `${borderWidths.left}px ${borderStyle} ${borderColor}`
			: undefined,
		boxSizing: hasBorder ? ("border-box" as const) : undefined,
	};
});
</script>

<template>
	<div :style="stackStyle" data-kiv-type="stack">
		<slot />
	</div>
</template>
