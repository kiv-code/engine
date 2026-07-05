<script setup lang="ts">
import type { KivNode } from "@kiv/engine";
import { computed, inject, ref } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";
import { getNodeLabel } from "../utils/node-labels";
import NodeIcon from "./NodeIcon.vue";

const props = defineProps<{ node: KivNode; depth?: number }>();
const store = inject(EDITOR_STORE_KEY);

const allChildren = (node: KivNode): KivNode[] =>
	Object.values(node.slots ?? {}).flat();

// Reactive — recomputes when store.document changes (after move/add/remove)
const children = computed(() => allChildren(props.node));
const collapsed = ref(false);

// ── DnD ──────────────────────────────────────────────────────────────────────
const dropZone = ref<"before" | "inside" | "after" | null>(null);

function onDragStart(e: DragEvent) {
	e.dataTransfer?.setData("text/plain", props.node.id);
	if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
	setTimeout(() => {
		(e.target as HTMLElement).style.opacity = "0.4";
	}, 0);
}
function onDragEnd(e: DragEvent) {
	(e.target as HTMLElement).style.opacity = "";
	dropZone.value = null;
}
function onDragOver(e: DragEvent) {
	e.preventDefault();
	if (!e.dataTransfer) return;
	e.dataTransfer.dropEffect = "move";
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
	const y = e.clientY - rect.top;
	const h = rect.height;
	if (y < h * 0.25) dropZone.value = "before";
	else if (y > h * 0.75) dropZone.value = "after";
	else dropZone.value = "inside";
}
function onDragLeave() {
	dropZone.value = null;
}

function onDrop(e: DragEvent) {
	e.preventDefault();
	const draggedId = e.dataTransfer?.getData("text/plain");
	dropZone.value = null;
	if (!draggedId || draggedId === props.node.id || !store) return;

	function isDescendant(parent: KivNode, targetId: string): boolean {
		return allChildren(parent).some(
			(c) => c.id === targetId || isDescendant(c, targetId),
		);
	}
	if (isDescendant(props.node, draggedId)) return;

	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
	const y = e.clientY - rect.top;
	const h = rect.height;
	const zone = y < h * 0.25 ? "before" : y > h * 0.75 ? "after" : "inside";
	const doc = store.document.value;

	function findParent(
		current: KivNode,
		targetId: string,
	): { parent: KivNode; slot: string; index: number } | null {
		for (const [slot, ch] of Object.entries(current.slots ?? {})) {
			for (let i = 0; i < ch.length; i++) {
				const child = ch[i];
				if (!child) continue;
				if (child.id === targetId) return { parent: current, slot, index: i };
				const found = findParent(child, targetId);
				if (found) return found;
			}
		}
		return null;
	}

	if (zone === "inside") {
		const slots = Object.keys(props.node.slots ?? {});
		const slotName = slots[0] ?? "default";
		store.moveNode(draggedId, props.node.id, slotName, children.value.length);
	} else {
		const loc = findParent(doc.root, props.node.id);
		if (!loc) return;
		store.moveNode(
			draggedId,
			loc.parent.id,
			loc.slot,
			zone === "before" ? loc.index : loc.index + 1,
		);
	}
}

// ── Context actions ───────────────────────────────────────────────────────────
function moveNode(direction: "up" | "down") {
	if (!store) return;
	const doc = store.document.value;
	function findParent(
		current: KivNode,
		targetId: string,
	): { parent: KivNode; slot: string; index: number } | null {
		for (const [slot, ch] of Object.entries(current.slots ?? {})) {
			for (let i = 0; i < ch.length; i++) {
				const child = ch[i];
				if (!child) continue;
				if (child.id === targetId) return { parent: current, slot, index: i };
				const found = findParent(child, targetId);
				if (found) return found;
			}
		}
		return null;
	}
	const loc = findParent(doc.root, props.node.id);
	if (!loc) return;
	const newIndex = direction === "up" ? loc.index - 1 : loc.index + 1;
	const siblings = loc.parent.slots?.[loc.slot] ?? [];
	if (newIndex < 0 || newIndex >= siblings.length) return;
	store.moveNode(props.node.id, loc.parent.id, loc.slot, newIndex);
}

const isSelected = () => store?.selected.value?.id === props.node.id;
const hasChildren = computed(() => children.value.length > 0);
</script>

<template>
	<div class="ktn">
		<div class="ktn__drop-line" :class="{ active: dropZone === 'before' }" />

		<div
			class="ktn__row"
			:class="{
				'ktn__row--selected': isSelected(),
				'ktn__row--drop-inside': dropZone === 'inside',
			}"
			:style="{ paddingLeft: `${8 + (depth ?? 0) * 14}px` }"
			draggable="true"
			@click="store?.select(node.id)"
			@dragstart="onDragStart"
			@dragend="onDragEnd"
			@dragover="onDragOver"
			@dragleave="onDragLeave"
			@drop="onDrop"
		>
			<!-- Collapse toggle -->
			<button
				v-if="hasChildren"
				type="button"
				class="ktn__collapse"
				:class="{ 'ktn__collapse--open': !collapsed }"
				@click.stop="collapsed = !collapsed"
			>
				<svg width="8" height="8" viewBox="0 0 8 8" fill="none">
					<path d="M2 3l2 2 2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<span v-else class="ktn__collapse-placeholder" />

			<!-- Drag handle -->
			<span class="ktn__drag" aria-hidden="true">
				<svg width="8" height="10" viewBox="0 0 8 10" fill="none">
					<circle cx="2" cy="2" r="1" fill="currentColor"/>
					<circle cx="6" cy="2" r="1" fill="currentColor"/>
					<circle cx="2" cy="5" r="1" fill="currentColor"/>
					<circle cx="6" cy="5" r="1" fill="currentColor"/>
					<circle cx="2" cy="8" r="1" fill="currentColor"/>
					<circle cx="6" cy="8" r="1" fill="currentColor"/>
				</svg>
			</span>

			<span class="ktn__icon"><NodeIcon :type="node.type" :size="13" /></span>
			<span class="ktn__type">{{ getNodeLabel(node.type) }}</span>
			<span v-if="hasChildren && collapsed" class="ktn__count">{{ children.length }}</span>

			<!-- Context actions (visible on hover / selected) -->
			<div class="ktn__actions" @click.stop>
				<button type="button" class="ktn__action" title="Move up" @click="moveNode('up')">
					<svg width="9" height="9" viewBox="0 0 9 9" fill="none">
						<path d="M4.5 7V2M2 4.5l2.5-2.5 2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<button type="button" class="ktn__action" title="Move down" @click="moveNode('down')">
					<svg width="9" height="9" viewBox="0 0 9 9" fill="none">
						<path d="M4.5 2v5M2 4.5l2.5 2.5 2.5-2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<button
					type="button"
					class="ktn__action ktn__action--danger"
					title="Delete"
					@click="store?.removeNode(node.id)"
				>
					<svg width="9" height="9" viewBox="0 0 9 9" fill="none">
						<path d="M1.5 2.5h6M3.5 2.5V1.5h2v1M7 2.5l-.5 5a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5L2 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>

		<div class="ktn__drop-line" :class="{ active: dropZone === 'after' }" />

		<template v-if="!collapsed">
			<KivTreeNode
				v-for="child in children"
				:key="child.id"
				:node="child"
				:depth="(depth ?? 0) + 1"
			/>
		</template>
	</div>
</template>

<style scoped>
.ktn { }

.ktn__row {
	display: flex;
	align-items: center;
	gap: 4px;
	width: 100%;
	padding-top: 5px;
	padding-bottom: 5px;
	padding-right: 4px;
	background: none;
	border: none;
	cursor: pointer;
	text-align: left;
	font-size: 0.78rem;
	white-space: nowrap;
	overflow: hidden;
	color: var(--color-text-secondary);
	font-family: inherit;
	transition: background 0.1s, color 0.1s;
	border-radius: 4px;
	margin: 0 4px;
}
.ktn__row:hover {
	background: var(--color-surface-overlay);
	color: var(--color-text-primary);
}
.ktn__row--selected {
	background: rgba(99, 102, 241, 0.12);
	color: #a5b4fc;
}
.ktn__row--drop-inside {
	background: rgba(99, 102, 241, 0.18) !important;
	outline: 1px solid rgba(99, 102, 241, 0.5);
	outline-offset: -1px;
}

/* Collapse toggle */
.ktn__collapse {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	color: var(--color-text-muted);
	border-radius: 3px;
	padding: 0;
	transform: rotate(-90deg);
	transition: transform 0.15s, color 0.1s;
}
.ktn__collapse--open { transform: rotate(0deg); }
.ktn__collapse:hover { color: var(--color-text-primary); background: rgba(255,255,255,0.06); }
.ktn__collapse-placeholder { width: 14px; flex-shrink: 0; }

/* Drag handle */
.ktn__drag {
	flex-shrink: 0;
	width: 12px;
	color: transparent;
	cursor: grab;
	display: flex;
	align-items: center;
	transition: color 0.1s;
}
.ktn__row:hover .ktn__drag { color: var(--color-text-muted); }
.ktn__row:active .ktn__drag { cursor: grabbing; }

.ktn__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 15px;
	flex-shrink: 0;
	opacity: 0.7;
}
.ktn__type {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: 500;
}
.ktn__count {
	font-size: 0.6rem;
	background: var(--color-border);
	color: var(--color-text-muted);
	border-radius: 8px;
	padding: 0 5px;
	min-width: 14px;
	text-align: center;
	flex-shrink: 0;
}

/* Context actions — hidden by default, visible on hover/selected */
.ktn__actions {
	display: none;
	align-items: center;
	gap: 1px;
	flex-shrink: 0;
}
.ktn__row:hover .ktn__actions,
.ktn__row--selected .ktn__actions {
	display: flex;
}
.ktn__action {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	background: none;
	border: none;
	border-radius: 3px;
	cursor: pointer;
	color: var(--color-text-muted);
	transition: background 0.1s, color 0.1s;
	padding: 0;
}
.ktn__action:hover {
	background: rgba(255,255,255,0.08);
	color: var(--color-text-primary);
}
.ktn__action--danger:hover {
	background: rgba(239, 68, 68, 0.15);
	color: #f87171;
}

/* Drop indicators */
.ktn__drop-line {
	height: 2px;
	margin: 0 6px;
	border-radius: 2px;
	background: transparent;
	transition: background 0.08s;
	position: relative;
}
.ktn__drop-line.active {
	background: #6366f1;
	box-shadow: 0 0 6px rgba(99, 102, 241, 0.6);
}
.ktn__drop-line.active::before {
	content: "";
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #6366f1;
}
</style>
