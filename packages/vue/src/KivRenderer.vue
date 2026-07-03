<script setup lang="ts">
import type { Breakpoint, KivDocument } from "@kiv/engine";
import { computed, provide } from "vue";
import { KIV_CONTEXT_KEY } from "./context";
import { KIV_EDITOR_MODE_KEY } from "./editor-mode";
import KivNodeRenderer from "./KivNodeRenderer.vue";
import type { VueRegistry } from "./registry";

const props = defineProps<{
	document: KivDocument;
	registry: VueRegistry;
	locale?: string;
	breakpoint?: Breakpoint;
	editorMode?: boolean;
}>();

// Reactive provide — updates when breakpoint/locale props change
const ctx = computed(() => ({
	registry: props.registry,
	resolveCtx: {
		locale: props.locale ?? props.document.i18n.default,
		breakpoint: props.breakpoint ?? "base",
		fallbackLocale: props.document.i18n.fallback,
	},
}));

provide(KIV_CONTEXT_KEY, ctx);
provide(KIV_EDITOR_MODE_KEY, props.editorMode ?? false);
</script>

<template>
	<KivNodeRenderer :node="document.root" />
</template>
