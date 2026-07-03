<script setup lang="ts">
import { KivEditor } from "@kiv/editor";
import type { KivDocument } from "@kiv/engine";
import { createEngine } from "@kiv/engine";
import { ALL_NODES } from "@kiv/nodes";
import { createDefaultVueRegistry } from "@kiv/vue";
import { ref } from "vue";
import { demoDocument } from "./demo-document";

// Boot the engine — registers nodes + generates CSS variables
const engine = createEngine({ nodes: [...ALL_NODES] });
const vueRegistry = createDefaultVueRegistry();

// Inject CSS variables into <head> so tokens resolve in the canvas
const styleEl = document.createElement("style");
styleEl.textContent = engine.css();
document.head.appendChild(styleEl);

const doc = ref<KivDocument>(demoDocument);

function onDocumentUpdate(updated: KivDocument) {
	doc.value = updated;
}
</script>

<template>
	<div class="demo">
		<header class="demo__header">
			<span class="demo__logo">⚡ Kiv</span>
			<span class="demo__subtitle">Vue Demo — Visual Experience Engine</span>
		</header>
		<div class="demo__editor">
			<KivEditor
				:document="doc"
				:registry="engine.registry"
				:vue-registry="vueRegistry"
				@update:document="onDocumentUpdate"
			/>
		</div>
	</div>
</template>

<style>
.demo {
	display: flex;
	flex-direction: column;
	height: 100vh;
	font-family: ui-sans-serif, system-ui, sans-serif;
}
.demo__header {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 16px;
	background: #0f172a;
	color: #f8fafc;
	font-size: 0.9rem;
	flex-shrink: 0;
}
.demo__logo {
	font-weight: 700;
	font-size: 1rem;
}
.demo__subtitle {
	color: #94a3b8;
	font-size: 0.8rem;
}
.demo__editor {
	flex: 1;
	overflow: hidden;
}
</style>
