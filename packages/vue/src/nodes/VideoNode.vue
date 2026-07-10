<script setup lang="ts">
import { RADIUS, SHADOW } from "@kiv/nodes";
import { computed } from "vue";

const props = defineProps<{
	src?: string;
	provider?: string;
	videoId?: string;
	aspectRatio?: string;
	borderRadius?: string;
	shadow?: string;
	autoplay?: boolean;
	controls?: boolean;
	loop?: boolean;
	muted?: boolean;
}>();

function embedUrl(provider: string, videoId: string): string {
	if (provider === "youtube") {
		return `https://www.youtube-nocookie.com/embed/${videoId}`;
	}
	if (provider === "vimeo") {
		return `https://player.vimeo.com/video/${videoId}`;
	}
	return "";
}

const iframeSrc = computed(() => {
	const provider = props.provider ?? "youtube";
	const videoId = props.videoId ?? "";
	const src =
		provider === "custom" ? (props.src ?? "") : embedUrl(provider, videoId);
	if (!src) return "";
	const params = new URLSearchParams();
	if (props.autoplay) params.set("autoplay", "1");
	if (props.loop) params.set("loop", "1");
	if (props.muted) params.set("mute", "1");
	if (props.controls !== undefined && !props.controls)
		params.set("controls", "0");
	const qs = params.toString();
	return qs ? `${src}?${qs}` : src;
});

const containerStyle = computed(() => ({
	position: "relative" as const,
	width: "100%",
	paddingBottom: props.aspectRatio === "4/3" ? "75%" : ("56.25%" as string),
	height: 0,
	overflow: "hidden" as const,
	borderRadius: RADIUS[props.borderRadius ?? "none"] ?? "0",
	boxShadow: SHADOW[props.shadow ?? "none"] ?? "none",
}));
</script>

<template>
	<div v-if="iframeSrc" :style="containerStyle" data-kiv-type="video">
		<iframe
			:src="iframeSrc"
			style="position:absolute;inset:0;width:100%;height:100%;border:0;"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
	</div>
	<div v-else :style="containerStyle" data-kiv-type="video">
		<p style="padding:1rem;text-align:center;color:#999;">No video source configured</p>
	</div>
</template>
