<script setup lang="ts">
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
}>();

const blurMap: Record<string, string> = {
	none: "0",
	sm: "4px",
	md: "8px",
	lg: "16px",
};

const radiusMap: Record<string, string> = {
	none: "0",
	sm: "var(--kiv-radius-sm, 0.25rem)",
	md: "var(--kiv-radius-md, 0.5rem)",
	lg: "var(--kiv-radius-lg, 1rem)",
	full: "var(--kiv-radius-full, 9999px)",
};

const sectionStyle = computed(() => {
	const s: Record<string, string> = {};

	if (props.background && props.background !== "transparent") {
		s["background-color"] = props.background;
	}
	if (props.backgroundImage) {
		s["background-image"] = `url(${props.backgroundImage})`;
		s["background-size"] = props.backgroundSize ?? "cover";
		s["background-position"] = props.backgroundPosition ?? "center";
	}
	if (props.gradient) {
		s["background-image"] = props.gradient;
	}
	if (props.blur && props.blur !== "none") {
		s["backdrop-filter"] = `blur(${blurMap[props.blur] ?? props.blur})`;
	}
	if (props.opacity !== undefined && props.opacity !== 1) {
		s.opacity = String(props.opacity);
	}

	// Spacing via tokens
	if (props.paddingY && props.paddingY !== "none") {
		s["padding-top"] = `var(--kiv-spacing-${props.paddingY})`;
		s["padding-bottom"] = `var(--kiv-spacing-${props.paddingY})`;
	}
	if (props.paddingX && props.paddingX !== "none") {
		s["padding-left"] = `var(--kiv-spacing-${props.paddingX})`;
		s["padding-right"] = `var(--kiv-spacing-${props.paddingX})`;
	}
	if (props.marginY && props.marginY !== "none") {
		s["margin-top"] = `var(--kiv-spacing-${props.marginY})`;
		s["margin-bottom"] = `var(--kiv-spacing-${props.marginY})`;
	}

	// Border
	if (props.borderWidth && props.borderWidth !== "0") {
		s["border-width"] = `${props.borderWidth}px`;
		s["border-style"] = "solid";
		if (props.borderColor) s["border-color"] = props.borderColor;
	}
	if (props.borderRadius && props.borderRadius !== "none") {
		s["border-radius"] = radiusMap[props.borderRadius] ?? props.borderRadius;
	}

	if (props.shadow && props.shadow !== "none") {
		s["box-shadow"] = `var(--kiv-shadow-${props.shadow})`;
	}
	if (props.minHeight) {
		s["min-height"] = props.minHeight;
	}

	return s;
});
</script>

<template>
	<section
		:style="sectionStyle"
		data-kiv-type="section"
		class="kiv-section"
	>
		<div
			v-if="overlay"
			class="kiv-section__overlay"
			:style="{
				background: overlayColor ?? 'rgba(0,0,0,0.4)',
				opacity: String(overlayOpacity ?? 0.4),
			}"
		/>
		<div v-if="backgroundVideo" class="kiv-section__video-bg">
			<video autoplay muted loop playsinline :src="backgroundVideo" />
		</div>
		<div class="kiv-section__content">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.kiv-section {
	position: relative;
	width: 100%;
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
}
</style>
