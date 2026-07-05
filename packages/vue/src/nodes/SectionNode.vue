<script setup lang="ts">
import { BLUR, RADIUS, SECTION_SPACING, SHADOW } from "@kiv/nodes";
import { computed } from "vue";

const props = defineProps<{
	background?: string;
	backgroundImage?: string;
	backgroundVideo?: string;
	backgroundSize?: string;
	backgroundPosition?: string;
	overlay?: boolean;
	overlayColor?: string;
	overlayOpacity?: number;
	gradient?: string;
	blur?: string;
	opacity?: number;
	paddingY?: string;
	paddingX?: string;
	marginY?: string;
	borderWidth?: string;
	borderColor?: string;
	borderRadius?: string;
	shadow?: string;
	fullWidth?: boolean;
	minHeight?: string;
	alignItems?: string;
	justifyContent?: string;
}>();

const sectionStyle = computed(() => {
	const s: Record<string, string> = {};

	if (props.background && props.background !== "transparent") {
		s.backgroundColor = props.background;
	}
	if (props.backgroundImage) {
		s.backgroundImage = `url(${props.backgroundImage})`;
		s.backgroundSize = props.backgroundSize ?? "cover";
		s.backgroundPosition = props.backgroundPosition ?? "center";
	}
	if (props.gradient) {
		s.backgroundImage = props.gradient;
	}
	if (props.opacity !== undefined && props.opacity !== 1) {
		s.opacity = String(props.opacity);
	}
	if (props.paddingY && props.paddingY !== "none") {
		const v = SECTION_SPACING[props.paddingY] ?? props.paddingY;
		s.paddingTop = v;
		s.paddingBottom = v;
	}
	if (props.paddingX && props.paddingX !== "none") {
		const v = SECTION_SPACING[props.paddingX] ?? props.paddingX;
		s.paddingLeft = v;
		s.paddingRight = v;
	}
	if (props.marginY && props.marginY !== "none") {
		const v = SECTION_SPACING[props.marginY] ?? props.marginY;
		s.marginTop = v;
		s.marginBottom = v;
	}
	if (props.borderWidth && props.borderWidth !== "0") {
		s.borderWidth = `${props.borderWidth}px`;
		s.borderStyle = "solid";
		if (props.borderColor) s.borderColor = props.borderColor;
	}
	if (props.borderRadius && props.borderRadius !== "none") {
		s.borderRadius = RADIUS[props.borderRadius] ?? props.borderRadius;
	}
	if (props.shadow && props.shadow !== "none") {
		s.boxShadow = SHADOW[props.shadow] ?? props.shadow;
	}
	if (props.minHeight) {
		s.minHeight = props.minHeight;
	}

	return s;
});

const bgBlurStyle = computed(() => {
	const amount = BLUR[props.blur ?? "none"] ?? "0";
	if (amount === "0") return null;
	return {
		position: "absolute" as const,
		inset: "0",
		backdropFilter: `blur(${amount})`,
		pointerEvents: "none" as const,
		zIndex: "0",
	};
});

const contentStyle = computed(() => ({
	alignItems:
		props.alignItems && props.alignItems !== "flex-start"
			? props.alignItems
			: undefined,
	justifyContent:
		props.justifyContent && props.justifyContent !== "flex-start"
			? props.justifyContent
			: undefined,
}));
</script>

<template>
	<section :style="sectionStyle" data-kiv-type="section" class="kiv-section">
		<div v-if="backgroundVideo" class="kiv-section__video-bg">
			<video autoplay muted loop playsinline :src="backgroundVideo" />
		</div>
		<div v-if="bgBlurStyle" :style="bgBlurStyle" />
		<div
			v-if="overlay"
			class="kiv-section__overlay"
			:style="{ background: overlayColor ?? 'rgba(0,0,0,0.4)', opacity: String(overlayOpacity ?? 0.4) }"
		/>
		<div class="kiv-section__content" :style="contentStyle">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.kiv-section {
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.kiv-section__overlay {
	position: absolute;
	inset: 0;
	pointer-events: none;
}
.kiv-section__video-bg {
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
}
.kiv-section__video-bg video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.kiv-section__content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	flex: 1;
}
</style>
