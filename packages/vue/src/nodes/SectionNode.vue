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

const BLUR_MAP: Record<string, string> = {
	none: "0",
	sm: "4px",
	md: "8px",
	lg: "16px",
};

const RADIUS_MAP: Record<string, string> = {
	none: "0",
	sm: "4px",
	md: "8px",
	lg: "16px",
	full: "9999px",
};

const SHADOW_MAP: Record<string, string> = {
	none: "none",
	sm: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
	md: "0 4px 16px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)",
	lg: "0 10px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.12)",
};

const SPACING_MAP: Record<string, string> = {
	none: "0",
	sm: "16px",
	md: "32px",
	lg: "64px",
	xl: "96px",
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
	if (props.opacity !== undefined && props.opacity !== 1) {
		s.opacity = String(props.opacity);
	}

	// Spacing — real px values, no tokens
	if (props.paddingY && props.paddingY !== "none") {
		const v = SPACING_MAP[props.paddingY] ?? props.paddingY;
		s["padding-top"] = v;
		s["padding-bottom"] = v;
	}
	if (props.paddingX && props.paddingX !== "none") {
		const v = SPACING_MAP[props.paddingX] ?? props.paddingX;
		s["padding-left"] = v;
		s["padding-right"] = v;
	}
	if (props.marginY && props.marginY !== "none") {
		const v = SPACING_MAP[props.marginY] ?? props.marginY;
		s["margin-top"] = v;
		s["margin-bottom"] = v;
	}

	// Border
	if (props.borderWidth && props.borderWidth !== "0") {
		s["border-width"] = `${props.borderWidth}px`;
		s["border-style"] = "solid";
		if (props.borderColor) s["border-color"] = props.borderColor;
	}
	if (props.borderRadius && props.borderRadius !== "none") {
		s["border-radius"] = RADIUS_MAP[props.borderRadius] ?? props.borderRadius;
	}

	if (props.shadow && props.shadow !== "none") {
		s["box-shadow"] = SHADOW_MAP[props.shadow] ?? props.shadow;
	}
	if (props.minHeight) {
		s["min-height"] = props.minHeight;
	}

	return s;
});

// Blur applies to the background layer pseudo-element via a separate div
const bgBlurStyle = computed(() => {
	const amount = BLUR_MAP[props.blur ?? "none"] ?? "0";
	if (amount === "0") return null;
	return {
		position: "absolute" as const,
		inset: "0",
		backdropFilter: `blur(${amount})`,
		pointerEvents: "none" as const,
		zIndex: "0",
	};
});
</script>

<template>
	<section
		:style="sectionStyle"
		data-kiv-type="section"
		class="kiv-section"
	>
		<!-- Background video -->
		<div v-if="backgroundVideo" class="kiv-section__video-bg">
			<video autoplay muted loop playsinline :src="backgroundVideo" />
		</div>
		<!-- Backdrop blur layer (sits above bg, below content) -->
		<div v-if="bgBlurStyle" :style="bgBlurStyle" />
		<!-- Overlay -->
		<div
			v-if="overlay"
			class="kiv-section__overlay"
			:style="{
				background: overlayColor ?? 'rgba(0,0,0,0.4)',
				opacity: String(overlayOpacity ?? 0.4),
			}"
		/>
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
