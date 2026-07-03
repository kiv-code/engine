<script setup lang="ts">
import type { Breakpoint, KivDocument } from "@kiv/engine";
import { computed, provide } from "vue";
import { KIV_CONTEXT_KEY } from "./context";
import KivNodeRenderer from "./KivNodeRenderer.vue";
import type { VueRegistry } from "./registry";

const props = defineProps<{
	document: KivDocument;
	registry: VueRegistry;
	locale?: string;
	breakpoint?: Breakpoint;
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
</script>

<template>
	<KivNodeRenderer :node="document.root" />
</template>
