<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		embedType?: string;
		html?: string;
		iframeUrl?: string;
		height?: number;
		sandboxed?: boolean;
	}>(),
	{ sandboxed: true },
);

const isHtml = computed(() => (props.embedType ?? "iframe") === "html");

// Both modes always render through an <iframe>, never raw v-html on the main
// page DOM — see packages/nodes/src/content/embed.ts's toHtml for the full
// rationale. `html` mode's srcdoc iframe never gets allow-same-origin (that
// would hand the embedded script the parent page's own origin); an `iframe`
// mode src is a genuinely different origin already, so allow-same-origin
// there only grants the embed its OWN origin, which real embeds often need.
const sandboxAttr = computed(() => {
	if (!props.sandboxed) return undefined;
	return isHtml.value
		? "allow-scripts"
		: "allow-scripts allow-same-origin allow-popups allow-forms";
});

const iframeStyle = computed(() => ({
	width: "100%",
	height: `${props.height ?? 400}px`,
	border: "0",
	display: "block" as const,
}));
</script>

<template>
	<iframe
		v-if="isHtml"
		:srcdoc="html ?? ''"
		:sandbox="sandboxAttr"
		:style="iframeStyle"
		title="Custom embed"
		data-kiv-type="embed"
	/>
	<iframe
		v-else
		:src="iframeUrl ?? ''"
		:sandbox="sandboxAttr"
		:style="iframeStyle"
		title="Custom embed"
		data-kiv-type="embed"
	/>
</template>
