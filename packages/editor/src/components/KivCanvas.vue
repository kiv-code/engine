<script setup lang="ts">
import type { Breakpoint } from "@kiv/engine";
import type { VueRegistry } from "@kiv/vue";
import { KivRenderer } from "@kiv/vue";
import { computed, inject, ref, watch } from "vue";
import { useInlineEdit } from "../composables/useInlineEdit";
import { EDITOR_STORE_KEY } from "../store/context";

defineProps<{ registry: VueRegistry }>();

const store = inject(EDITOR_STORE_KEY);
const canvasRef = ref<HTMLElement | null>(null);

const breakpoint = computed<Breakpoint>(
	() => (store?.breakpoint.value ?? "base") as Breakpoint,
);

const CANVAS_WIDTHS: Record<string, string> = {
	base: "390px",
	sm: "640px",
	md: "768px",
	lg: "1280px",
	xl: "100%",
};

const BP_LABELS: Record<string, string> = {
	base: "Mobile · 390px",
	sm: "Small · 640px",
	md: "Tablet · 768px",
	lg: "Desktop · 1280px",
	xl: "Wide · Full",
};

const canvasWidth = computed(() => CANVAS_WIDTHS[breakpoint.value] ?? "100%");
const bpLabel = computed(() => BP_LABELS[breakpoint.value] ?? "");

// Inline edit — only wired up when store is available
const { onCanvasDblClick, deactivate } = store
	? useInlineEdit(store)
	: { onCanvasDblClick: () => {}, deactivate: () => {} };

function onCanvasClick(e: MouseEvent) {
	// Don't steal click from an active contenteditable
	const active = document.activeElement as HTMLElement | null;
	if (active?.contentEditable === "true") return;

	const target = (e.target as HTMLElement).closest(
		"[data-kiv-node-id]",
	) as HTMLElement | null;
	const id = target?.dataset.kivNodeId ?? null;
	store?.select(id);
	if (!id) deactivate();
}

watch(
	() => store?.selected.value?.id,
	(newId, oldId) => {
		const canvas = canvasRef.value;
		if (!canvas) return;
		if (oldId) {
			const prev = canvas.querySelector(
				`[data-kiv-node-id="${oldId}"]`,
			) as HTMLElement | null;
			if (prev) {
				// Don't clear outline if element is in inline-edit mode
				if (prev.getAttribute("data-kiv-editing") !== "true") {
					prev.style.outline = "";
					prev.style.outlineOffset = "";
				}
			}
		}
		if (newId) {
			const next = canvas.querySelector(
				`[data-kiv-node-id="${newId}"]`,
			) as HTMLElement | null;
			if (next && next.getAttribute("data-kiv-editing") !== "true") {
				next.style.outline = "2px solid #6366f1";
				next.style.outlineOffset = "-2px";
			}
		}
	},
);
</script>

<template>
	<div class="kiv-canvas" @click.stop="onCanvasClick" @dblclick.stop="onCanvasDblClick">
		<div class="kiv-canvas__bp-label">{{ bpLabel }}</div>
		<div class="kiv-canvas__stage">
			<div
				ref="canvasRef"
				class="kiv-canvas__frame"
				:style="{ width: canvasWidth }"
			>
				<KivRenderer
					v-if="store"
					:document="store.document.value"
					:registry="registry"
					:breakpoint="breakpoint"
					:editor-mode="true"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.kiv-canvas {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	overflow: auto;
	background-color: #0f1117;
	background-image: radial-gradient(circle, #1e2130 1px, transparent 1px);
	background-size: 24px 24px;
}
.kiv-canvas__bp-label {
	flex-shrink: 0;
	text-align: center;
	padding: 8px 0 0;
	font-size: 0.68rem;
	color: var(--color-text-muted);
	letter-spacing: 0.04em;
	font-variant-numeric: tabular-nums;
}
.kiv-canvas__stage {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding: 16px 24px 48px;
}
.kiv-canvas__frame {
	background: #fff;
	box-shadow:
		0 0 0 1px rgba(255, 255, 255, 0.04),
		0 8px 40px rgba(0, 0, 0, 0.5);
	border-radius: 8px;
	overflow: hidden;
	min-height: 480px;
	transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
