<script setup lang="ts">
import { RADIUS, SHADOW } from "@kiv/nodes";
import { computed } from "vue";

const props = defineProps<{
	src?: string;
	alt?: string;
	fit?: string;
	aspectRatio?: string;
	width?: string;
	borderRadius?: string;
	shadow?: string;
}>();

const imageStyle = computed(() => ({
	objectFit: (props.fit ?? "cover") as "cover" | "contain" | "fill" | "none",
	aspectRatio: props.aspectRatio !== "auto" ? props.aspectRatio : undefined,
	width: props.width ?? "100%",
	maxWidth: "100%",
	display: "block",
	borderRadius: RADIUS[props.borderRadius ?? "none"] ?? "0",
	boxShadow: SHADOW[props.shadow ?? "none"] ?? "none",
}));
</script>

<template>
	<img :src="src" :alt="alt ?? ''" :style="imageStyle" data-kiv-type="image" />
</template>
