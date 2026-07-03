<script setup lang="ts">
import { computed, inject } from "vue";
import { KIV_EDITOR_MODE_KEY } from "../editor-mode";

const props = defineProps<{
	label?: string;
	href?: string;
	target?: string;
	linkType?: string;
	variant?: string;
	size?: string;
	fullWidth?: boolean;
}>();

const isEditorMode = inject(KIV_EDITOR_MODE_KEY, false);

const resolvedHref = computed(() =>
	isEditorMode ? undefined : (props.href ?? "#"),
);
const resolvedTarget = computed(() => {
	if (isEditorMode) return undefined;
	if (props.linkType === "external") return "_blank";
	return props.target ?? "_self";
});
const rel = computed(() =>
	resolvedTarget.value === "_blank" ? "noopener noreferrer" : undefined,
);

const buttonStyle = computed(() => ({
	display: props.fullWidth ? "block" : "inline-block",
	width: props.fullWidth ? "100%" : undefined,
	cursor: isEditorMode ? "default" : undefined,
}));

function onClick(e: MouseEvent) {
	if (isEditorMode) e.preventDefault();
}
</script>

<template>
	<a
		:href="resolvedHref"
		:target="resolvedTarget"
		:rel="rel"
		:style="buttonStyle"
		:data-kiv-variant="variant"
		:data-kiv-size="size"
		:data-kiv-link-type="linkType"
		data-kiv-type="button"
		class="kiv-button"
		@click="onClick"
	>
		{{ label }}
	</a>
</template>
