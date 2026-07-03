<script setup lang="ts">
import type { KivNode } from "@kiv/engine";
import { inject, ref } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";
import { getNodeIcon } from "../utils/node-icons";
import KivTreeNode from "./KivTreeNode.vue";

const store = inject(EDITOR_STORE_KEY);
const showPalette = ref(false);

interface PaletteItem {
	type: string;
	label: string;
	defaultSlot: string;
	category: "layout" | "content" | "media";
}

const PALETTE: PaletteItem[] = [
	{
		type: "section",
		label: "Section",
		defaultSlot: "default",
		category: "layout",
	},
	{
		type: "container",
		label: "Container",
		defaultSlot: "default",
		category: "layout",
	},
	{ type: "stack", label: "Stack", defaultSlot: "default", category: "layout" },
	{ type: "grid", label: "Grid", defaultSlot: "default", category: "layout" },
	{ type: "heading", label: "Heading", defaultSlot: "", category: "content" },
	{ type: "text", label: "Text", defaultSlot: "", category: "content" },
	{ type: "button", label: "Button", defaultSlot: "", category: "content" },
	{ type: "image", label: "Image", defaultSlot: "", category: "media" },
];

function addNode(item: PaletteItem) {
	if (!store) return;
	const parent = store.selected.value ?? store.document.value.root;
	// Find a valid slot — use the first available slot from the parent's slots or "default"
	const slots = Object.keys(parent.slots ?? {});
	const slotName = slots[0] ?? "default";

	const newNode: KivNode = {
		id: `${item.type}-${Math.random().toString(36).slice(2, 7)}`,
		type: item.type,
		props: {},
		slots: item.defaultSlot ? { default: [] } : undefined,
	};

	store.addNode(parent.id, slotName, newNode);
	store.select(newNode.id);
	showPalette.value = false;
}

const CATEGORY_LABELS: Record<string, string> = {
	layout: "Layout",
	content: "Content",
	media: "Media",
};

const categories = ["layout", "content", "media"] as const;
</script>

<template>
	<aside class="kiv-tree">
		<div class="kiv-tree__header">Structure</div>
		<div v-if="store" class="kiv-tree__body">
			<KivTreeNode :node="store.document.value.root" :depth="0" />
		</div>
		<div class="kiv-tree__palette-bar">
			<button
				type="button"
				class="kiv-tree__add-btn"
				@click="showPalette = !showPalette"
			>
				<span>+</span> Add node
			</button>
		</div>
		<div v-if="showPalette" class="kiv-tree__palette">
			<div v-for="cat in categories" :key="cat" class="kiv-palette__group">
				<div class="kiv-palette__cat-label">{{ CATEGORY_LABELS[cat] }}</div>
				<button
					v-for="item in PALETTE.filter((p) => p.category === cat)"
					:key="item.type"
					type="button"
					class="kiv-palette__item"
					@click="addNode(item)"
				>
					<span class="kiv-palette__icon">{{ getNodeIcon(item.type) }}</span>
					<span>{{ item.label }}</span>
				</button>
			</div>
		</div>
	</aside>
</template>

<style scoped>
.kiv-tree {
	width: 220px;
	min-width: 220px;
	flex-shrink: 0;
	border-right: 1px solid #e5e7eb;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: #fff;
}
.kiv-tree__header {
	padding: 8px 12px;
	font-size: 0.7rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #6b7280;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}
.kiv-tree__body {
	flex: 1;
	overflow-y: auto;
	padding: 4px 0;
}
.kiv-tree__palette-bar {
	border-top: 1px solid #e5e7eb;
	padding: 6px 8px;
	background: #f9fafb;
}
.kiv-tree__add-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	padding: 5px 8px;
	border: 1px dashed #d1d5db;
	border-radius: 4px;
	background: transparent;
	color: #6b7280;
	font-size: 0.78rem;
	cursor: pointer;
}
.kiv-tree__add-btn:hover {
	background: #f3f4f6;
	border-color: #9ca3af;
	color: #374151;
}
.kiv-tree__palette {
	border-top: 1px solid #e5e7eb;
	background: #fff;
	overflow-y: auto;
	max-height: 240px;
}
.kiv-palette__group {
	padding: 4px 0;
}
.kiv-palette__cat-label {
	padding: 4px 12px 2px;
	font-size: 0.65rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: #9ca3af;
}
.kiv-palette__item {
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
	padding: 5px 12px;
	background: none;
	border: none;
	cursor: pointer;
	font-size: 0.8rem;
	color: #374151;
	text-align: left;
}
.kiv-palette__item:hover {
	background: #f3f4f6;
	color: #111827;
}
.kiv-palette__icon {
	width: 16px;
	text-align: center;
	flex-shrink: 0;
	font-size: 0.75rem;
	color: #6b7280;
}
</style>
