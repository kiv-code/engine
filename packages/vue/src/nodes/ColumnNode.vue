<script setup lang="ts">
import { SPACING } from "@kiv/nodes";
import { computed } from "vue";

const props = defineProps<{
	span?: string;
	offset?: string;
	alignSelf?: string;
	paddingX?: string;
	paddingY?: string;
}>();

const columnStyle = computed(() => {
	const s: Record<string, string> = {};
	if (props.span && props.span !== "auto") s.gridColumn = `span ${props.span}`;
	if (props.offset && props.offset !== "0")
		s.gridColumnStart = String(Number(props.offset) + 1);
	if (props.alignSelf && props.alignSelf !== "auto")
		s.alignSelf = props.alignSelf;
	const px = SPACING[props.paddingX ?? "none"] ?? "0";
	const py = SPACING[props.paddingY ?? "none"] ?? "0";
	if (px !== "0") {
		s.paddingLeft = px;
		s.paddingRight = px;
	}
	if (py !== "0") {
		s.paddingTop = py;
		s.paddingBottom = py;
	}
	return s;
});
</script>

<template>
	<div :style="columnStyle" data-kiv-type="column">
		<slot />
	</div>
</template>
