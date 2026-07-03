<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	content?: string;
	color?: string;
	size?: number;
	align?: string;
	lineHeight?: string;
}>();

const textStyle = computed(() => ({
	color: props.color ?? "inherit",
	fontSize: `${props.size ?? 16}px`,
	textAlign: (props.align ?? "left") as "left" | "center" | "right" | "justify",
	lineHeight: props.lineHeight ?? "1.6",
	margin: "0",
}));
</script>

<template>
	<p :style="textStyle" data-kiv-type="text">{{ content }}</p>
</template>
