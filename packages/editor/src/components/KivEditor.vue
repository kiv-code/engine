<script setup lang="ts">
import type { KivDocument, Registry } from "@kiv/engine";
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
</script>

<template>
	<div class="kiv-editor">
		<header class="kiv-editor__toolbar">
			<button
				type="button"
				:disabled="!store.canUndo.value"
				@click="store.undo()"
			>
				Undo
			</button>
			<button
				type="button"
				:disabled="!store.canRedo.value"
				@click="store.redo()"
			>
				Redo
			</button>
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
	gap: 8px;
	padding: 8px 12px;
	border-bottom: 1px solid #e5e7eb;
	background: #fff;
}
.kiv-editor__toolbar button {
	padding: 4px 10px;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	background: #fff;
	cursor: pointer;
	font-size: 0.8rem;
}
.kiv-editor__toolbar button:disabled {
	opacity: 0.4;
	cursor: default;
}
.kiv-editor__body {
	display: flex;
	flex: 1;
	overflow: hidden;
}
</style>
