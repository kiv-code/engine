<script setup lang="ts">
import { inject } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";
import KivTreeNode from "./KivTreeNode.vue";

const store = inject(EDITOR_STORE_KEY);
</script>

<template>
	<aside class="kiv-tree">
		<div class="kiv-tree__header">Structure</div>
		<div v-if="store" class="kiv-tree__body">
			<KivTreeNode :node="store.document.value.root" :depth="0" />
		</div>
	</aside>
</template>

<style scoped>
.kiv-tree {
	width: 200px;
	border-right: 1px solid #e5e7eb;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.kiv-tree__header {
	padding: 8px 12px;
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: #6b7280;
	border-bottom: 1px solid #e5e7eb;
}
.kiv-tree__body {
	flex: 1;
	overflow-y: auto;
	padding: 4px 0;
}
</style>
