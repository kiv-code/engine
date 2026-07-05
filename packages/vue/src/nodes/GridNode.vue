<script setup lang="ts">
import { GAP } from "@kiv/nodes";
import { computed } from "vue";

const props = defineProps<{
	columns?: string;
	gap?: string;
	rowGap?: string;
	alignItems?: string;
}>();

const gridStyle = computed(() => ({
	display: "grid" as const,
	gridTemplateColumns: `repeat(${props.columns ?? "1"}, minmax(0, 1fr))`,
	columnGap: GAP[props.gap ?? "md"] ?? "16px",
	rowGap: GAP[props.rowGap ?? "md"] ?? "16px",
	alignItems: props.alignItems ?? "stretch",
}));
</script>

<template>
	<div :style="gridStyle" data-kiv-type="grid">
		<slot />
	</div>
</template>
