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
	background?: string;
	borderRadius?: string;
	shadow?: string;
}>();

const stackStyle = computed(() => ({
	display: "flex" as const,
	flexDirection: (props.direction === "row" ? "row" : "column") as
		| "row"
		| "column",
	gap: GAP[props.gap ?? "md"] ?? "16px",
	alignItems: props.align ?? "flex-start",
	justifyContent: props.justify ?? "flex-start",
	flexWrap: (props.wrap ? "wrap" : "nowrap") as "wrap" | "nowrap",
	paddingTop: SPACING[props.paddingY ?? "none"] ?? "0",
	paddingBottom: SPACING[props.paddingY ?? "none"] ?? "0",
	paddingLeft: SPACING[props.paddingX ?? "none"] ?? "0",
	paddingRight: SPACING[props.paddingX ?? "none"] ?? "0",
	background:
		props.background && props.background !== "transparent"
			? props.background
			: undefined,
	borderRadius: RADIUS[props.borderRadius ?? "none"] ?? "0",
	boxShadow: SHADOW[props.shadow ?? "none"] ?? "none",
}));
</script>

<template>
	<div :style="stackStyle" data-kiv-type="stack">
		<slot />
	</div>
</template>
