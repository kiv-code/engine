<script setup lang="ts">
import { MAX_WIDTH, SPACING } from "@kiv/nodes";
import { computed } from "vue";

const props = defineProps<{
	maxWidth?: string;
	paddingX?: string;
	paddingY?: string;
	centered?: boolean;
}>();

const containerStyle = computed(() => ({
	maxWidth: MAX_WIDTH[props.maxWidth ?? "lg"] ?? "1024px",
	marginLeft: props.centered !== false ? "auto" : undefined,
	marginRight: props.centered !== false ? "auto" : undefined,
	paddingLeft: SPACING[props.paddingX ?? "md"] ?? "16px",
	paddingRight: SPACING[props.paddingX ?? "md"] ?? "16px",
	paddingTop: SPACING[props.paddingY ?? "none"] ?? "0",
	paddingBottom: SPACING[props.paddingY ?? "none"] ?? "0",
	width: "100%",
}));
</script>

<template>
	<div :style="containerStyle" data-kiv-type="container">
		<slot />
	</div>
</template>
