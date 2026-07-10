<script setup lang="ts">
import type { Breakpoint } from "@kiv/engine";
import { findNode } from "@kiv/engine";
import type { VueRegistry } from "@kiv/vue";
import { KivRenderer } from "@kiv/vue";
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import { useInlineEdit } from "../composables/useInlineEdit";
import { EDITOR_EXTENSIONS_KEY, EDITOR_STORE_KEY } from "../store/context";
import { getNodeLabelShort } from "../utils/node-labels";

defineProps<{ registry: VueRegistry }>();

const store = inject(EDITOR_STORE_KEY);
const extensions = inject(EDITOR_EXTENSIONS_KEY, null);
const canvasRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const hoveredId = ref<string | null>(null);

function isLocked(id: string): boolean {
	if (!store) return false;
	return findNode(store.document.value, id)?.node.locked === true;
}

const breakpoint = computed<Breakpoint>(
	() => (store?.breakpoint.value ?? "base") as Breakpoint,
);
const locale = computed(() => store?.locale.value);

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

const { onCanvasDblClick, deactivate } = store
	? useInlineEdit(store)
	: { onCanvasDblClick: () => {}, deactivate: () => {} };

function onCanvasClick(e: MouseEvent) {
	const active = document.activeElement as HTMLElement | null;
	if (active?.contentEditable === "true") return;
	const target = (e.target as HTMLElement).closest(
		"[data-kiv-node-id]",
	) as HTMLElement | null;
	const id = target?.dataset.kivNodeId ?? null;
	if (id && isLocked(id)) return;
	store?.select(id);
	if (!id) deactivate();
}

function onCanvasDblClickGuarded(e: MouseEvent) {
	const target = (e.target as HTMLElement).closest(
		"[data-kiv-node-id]",
	) as HTMLElement | null;
	const id = target?.dataset.kivNodeId;
	if (id && isLocked(id)) return;
	onCanvasDblClick(e);
}

function onCanvasMouseMove(e: MouseEvent) {
	const target = (e.target as HTMLElement).closest(
		"[data-kiv-node-id]",
	) as HTMLElement | null;
	hoveredId.value = target?.dataset.kivNodeId ?? null;
}

function onCanvasMouseLeave() {
	hoveredId.value = null;
}

// ── Overlay labels ─────────────────────────────────────────────────────────────
interface OverlayItem {
	id: string;
	type: string;
	label: string;
	top: number;
	left: number;
	width: number;
	selected: boolean;
}

const overlayItems = computed((): OverlayItem[] => {
	const frame = canvasRef.value;
	const stage = stageRef.value;
	if (!frame || !stage) return [];
	const items: OverlayItem[] = [];
	const selectedId = store?.selected.value?.id;

	const ids = new Set<string>();
	if (hoveredId.value) ids.add(hoveredId.value);
	if (selectedId) ids.add(selectedId);

	const stageRect = stage.getBoundingClientRect();

	for (const id of ids) {
		const el = frame.querySelector(
			`[data-kiv-node-id="${id}"]`,
		) as HTMLElement | null;
		if (!el) continue;
		const type = (el.dataset.kivType ??
			el.querySelector("[data-kiv-type]")?.getAttribute("data-kiv-type") ??
			id.split("-")[0]) as string;
		const elRect = el.getBoundingClientRect();
		items.push({
			id,
			type,
			label: getNodeLabelShort(type),
			top: elRect.top - stageRect.top,
			left: elRect.left - stageRect.left,
			width: elRect.width,
			selected: id === selectedId,
		});
	}
	return items;
});

// ── Keyboard shortcuts ─────────────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
	const tag = (document.activeElement as HTMLElement)?.tagName;
	const isEditing =
		(document.activeElement as HTMLElement)?.contentEditable === "true";
	if (isEditing || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")
		return;

	const selected = store?.selected.value;
	const selectedLocked = selected ? isLocked(selected.id) : false;

	// First, check plugin-registered shortcuts
	if (extensions) {
		for (const sc of extensions.getKeyboardShortcuts()) {
			if (sc.keys === e.key.toLowerCase() || sc.keys === e.code) {
				e.preventDefault();
				sc.onTrigger();
				return;
			}
		}
	}

	if (
		(e.key === "Delete" || e.key === "Backspace") &&
		selected &&
		!selectedLocked
	) {
		e.preventDefault();
		store?.removeNode(selected.id);
		return;
	}
	if (
		e.key === "d" &&
		(e.metaKey || e.ctrlKey) &&
		selected &&
		!selectedLocked
	) {
		e.preventDefault();
		store?.duplicateNode(selected.id);
		return;
	}
	if (e.key === "z" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
		e.preventDefault();
		store?.undo();
		return;
	}
	if (e.key === "z" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
		e.preventDefault();
		store?.redo();
		return;
	}
	if (e.key === "Escape") store?.select(null);
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));

watch(
	() => store?.selected.value?.id,
	(newId, oldId) => {
		const frame = canvasRef.value;
		if (!frame) return;
		if (oldId) {
			const prev = frame.querySelector(
				`[data-kiv-node-id="${oldId}"]`,
			) as HTMLElement | null;
			if (prev && prev.getAttribute("data-kiv-editing") !== "true") {
				prev.style.outline = "";
				prev.style.outlineOffset = "";
			}
		}
		if (newId) {
			const next = frame.querySelector(
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
	<div
		class="kiv-canvas"
		@click.stop="onCanvasClick"
		@dblclick.stop="onCanvasDblClickGuarded"
		@mousemove="onCanvasMouseMove"
		@mouseleave="onCanvasMouseLeave"
	>
		<div class="kiv-canvas__bp-label">{{ bpLabel }}</div>
		<div ref="stageRef" class="kiv-canvas__stage">
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
					:locale="locale"
					:editor-mode="true"
				/>
			</div>

			<!-- Node label overlays (visual only) -->
			<template v-for="item in overlayItems" :key="item.id">
				<div
					class="kiv-canvas__label"
					:class="{ 'kiv-canvas__label--selected': item.selected }"
					:style="{ top: `${item.top}px`, left: `${item.left}px` }"
				>{{ item.label }}</div>
			</template>
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
	background-color: var(--color-surface-base);
	background-image: radial-gradient(circle, var(--color-border) 1px, transparent 1px);
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
	position: relative;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding: 16px 24px 48px;
}
.kiv-canvas__frame {
	background: #fff;
	box-shadow: var(--shadow-canvas-frame);
	border-radius: 8px;
	overflow: hidden;
	min-height: 480px;
	transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Label overlays — positioned relative to .kiv-canvas__stage */
.kiv-canvas__label {
	position: absolute;
	z-index: 100;
	transform: translateY(-100%);
	background: #6366f1;
	color: #fff;
	font-size: 10px;
	font-weight: 600;
	font-family: ui-sans-serif, system-ui, sans-serif;
	padding: 2px 6px;
	border-radius: 3px 3px 0 0;
	white-space: nowrap;
	line-height: 1.6;
	opacity: 0.9;
	pointer-events: none;
	user-select: none;
}
.kiv-canvas__label--selected { opacity: 1; }
</style>
