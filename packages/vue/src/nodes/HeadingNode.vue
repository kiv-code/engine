<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	text?: string;
	level?: string;
	color?: string;
	align?: string;
	size?: number;
}>();

const tag = computed(() => `h${props.level ?? "2"}`);

// Default sizes per heading level (px) — used when no explicit size is set
const LEVEL_DEFAULTS: Record<string, number> = {
	"1": 48,
	"2": 36,
	"3": 28,
	"4": 22,
	"5": 18,
	"6": 16,
};

const headingStyle = computed(() => ({
	color: props.color ?? "inherit",
	textAlign: (props.align ?? "left") as "left" | "center" | "right",
	fontSize: `${props.size ?? LEVEL_DEFAULTS[props.level ?? "2"] ?? 36}px`,
	lineHeight: "1.2",
	margin: "0",
	fontWeight: "700",
}));
</script>

<template>
	<component :is="tag" :style="headingStyle" data-kiv-type="heading">
		{{ text }}
	</component>
</template>
