<script setup lang="ts">
import type { Breakpoint } from "@kiv/engine";
import type { VueRegistry } from "@kiv/vue";
import { KivRenderer } from "@kiv/vue";
import { computed, inject, ref, watch } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";

defineProps<{ registry: VueRegistry }>();

const store = inject(EDITOR_STORE_KEY);
const canvasRef = ref<HTMLElement | null>(null);

const breakpoint = computed<Breakpoint>(
	() => (store?.breakpoint.value ?? "base") as Breakpoint,
);

// Canvas widths per breakpoint for realistic preview
const CANVAS_WIDTHS: Record<string, string> = {
	base: "100%",
	sm: "640px",
	md: "768px",
	lg: "1024px",
	xl: "1200px",
};

const canvasWidth = computed(() => CANVAS_WIDTHS[breakpoint.value] ?? "100%");

// Event delegation: click on any [data-kiv-node-id] selects it
function onCanvasClick(e: MouseEvent) {
	const target = (e.target as HTMLElement).closest(
		"[data-kiv-node-id]",
	) as HTMLElement | null;
	const id = target?.dataset.kivNodeId ?? null;
	store?.select(id);
}

// Outline the selected node in the DOM
watch(
	() => store?.selected.value?.id,
	(newId, oldId) => {
		const canvas = canvasRef.value;
		if (!canvas) return;
		if (oldId) {
			const prev = canvas.querySelector(
				`[data-kiv-node-id="${oldId}"]`,
			) as HTMLElement | null;
			if (prev) prev.style.outline = "";
		}
		if (newId) {
			const next = canvas.querySelector(
				`[data-kiv-node-id="${newId}"]`,
			) as HTMLElement | null;
			if (next) next.style.outline = "2px solid #3b82f6";
		}
	},
);
</script>

<template>
	<div class="kiv-canvas" @click="onCanvasClick">
		<div class="kiv-canvas__stage">
			<div class="kiv-canvas__inner" :style="{ width: canvasWidth }" ref="canvasRef">
				<KivRenderer
					v-if="store"
					:document="store.document.value"
					:registry="registry"
					:breakpoint="breakpoint"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.kiv-canvas {
	flex: 1;
	min-width: 0;
	overflow: auto;
	background: #e5e7eb;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.kiv-canvas__stage {
	padding: 24px;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
}
.kiv-canvas__inner {
	background: #fff;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
	border-radius: 6px;
	overflow: hidden;
	min-height: 400px;
	transition: width 0.2s ease;
}
</style>
