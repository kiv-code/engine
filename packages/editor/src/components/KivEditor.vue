<script setup lang="ts">
import type { Breakpoint, KivDocument, Registry } from "@kiv/engine";
import type { VueRegistry } from "@kiv/vue";
import { provide, watch } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";
import { useEditorStore } from "../store/editor-store";
import KivCanvas from "./KivCanvas.vue";
import KivInspector from "./KivInspector.vue";
import KivTree from "./KivTree.vue";

const props = defineProps<{
	document: KivDocument;
	registry: Registry;
	vueRegistry: VueRegistry;
}>();

const emit = defineEmits<{ "update:document": [doc: KivDocument] }>();

const store = useEditorStore(props.document, props.registry);
provide(EDITOR_STORE_KEY, store);

watch(
	() => store.document.value,
	(doc) => emit("update:document", doc),
	{ deep: true },
);

const BREAKPOINTS: { value: Breakpoint; label: string; icon: string }[] = [
	{ value: "base", label: "Mobile", icon: "📱" },
	{ value: "md", label: "Tablet", icon: "📟" },
	{ value: "lg", label: "Desktop", icon: "🖥" },
	{ value: "xl", label: "Wide", icon: "⬛" },
];
</script>

<template>
	<div class="kiv-editor">
		<header class="kiv-editor__toolbar">
			<div class="kiv-editor__toolbar-group">
				<button
					type="button"
					class="kiv-toolbar-btn"
					:disabled="!store.canUndo.value"
					@click="store.undo()"
					title="Undo"
				>
					↩ Undo
				</button>
				<button
					type="button"
					class="kiv-toolbar-btn"
					:disabled="!store.canRedo.value"
					@click="store.redo()"
					title="Redo"
				>
					↪ Redo
				</button>
			</div>
			<div class="kiv-editor__breakpoints">
				<button
					v-for="bp in BREAKPOINTS"
					:key="bp.value"
					type="button"
					class="kiv-bp-btn"
					:class="{ 'kiv-bp-btn--active': store.breakpoint.value === bp.value }"
					:title="bp.label"
					@click="store.setBreakpoint(bp.value)"
				>
					<span class="kiv-bp-btn__icon">{{ bp.icon }}</span>
					<span class="kiv-bp-btn__label">{{ bp.label }}</span>
				</button>
			</div>
		</header>
		<div class="kiv-editor__body">
			<KivTree />
			<KivCanvas :registry="vueRegistry" />
			<KivInspector :registry="registry" />
		</div>
	</div>
</template>

<style scoped>
.kiv-editor {
	display: flex;
	flex-direction: column;
	height: 100%;
	font-family: ui-sans-serif, system-ui, sans-serif;
	font-size: 14px;
}
.kiv-editor__toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 6px 12px;
	border-bottom: 1px solid #e5e7eb;
	background: #fff;
	gap: 12px;
}
.kiv-editor__toolbar-group {
	display: flex;
	gap: 4px;
}
.kiv-toolbar-btn {
	padding: 4px 10px;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	background: #fff;
	cursor: pointer;
	font-size: 0.78rem;
	color: #374151;
	display: flex;
	align-items: center;
	gap: 4px;
}
.kiv-toolbar-btn:hover:not(:disabled) {
	background: #f3f4f6;
}
.kiv-toolbar-btn:disabled {
	opacity: 0.4;
	cursor: default;
}
.kiv-editor__breakpoints {
	display: flex;
	gap: 2px;
	background: #f3f4f6;
	border-radius: 6px;
	padding: 2px;
}
.kiv-bp-btn {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 4px 10px;
	border: none;
	border-radius: 4px;
	background: transparent;
	cursor: pointer;
	font-size: 0.75rem;
	color: #6b7280;
	transition: background 0.1s, color 0.1s;
}
.kiv-bp-btn:hover {
	background: #e5e7eb;
	color: #374151;
}
.kiv-bp-btn--active {
	background: #fff;
	color: #1d4ed8;
	font-weight: 600;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.kiv-bp-btn__icon {
	font-size: 0.9rem;
}
.kiv-bp-btn__label {
	font-size: 0.72rem;
}
.kiv-editor__body {
	display: flex;
	flex: 1;
	overflow: hidden;
}
</style>
