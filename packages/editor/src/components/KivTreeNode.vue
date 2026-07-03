<script setup lang="ts">
import type { KivNode } from "@kiv/engine";
import { inject } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";

const props = defineProps<{ node: KivNode; depth?: number }>();
const store = inject(EDITOR_STORE_KEY);

const allChildren = (node: KivNode): KivNode[] =>
	Object.values(node.slots ?? {}).flat();
</script>

<template>
	<div class="kiv-tree-node" :style="{ paddingLeft: `${(depth ?? 0) * 12}px` }">
		<button
			class="kiv-tree-node__label"
			:class="{ 'kiv-tree-node__label--selected': store?.selected.value?.id === node.id }"
			type="button"
			@click="store?.select(node.id)"
		>
			<span class="kiv-tree-node__type">{{ node.type }}</span>
			<span class="kiv-tree-node__id">{{ node.id }}</span>
		</button>
		<KivTreeNode
			v-for="child in allChildren(node)"
			:key="child.id"
			:node="child"
			:depth="(depth ?? 0) + 1"
		/>
	</div>
</template>

<style scoped>
.kiv-tree-node__label {
	display: flex;
	align-items: center;
	gap: 6px;
	width: 100%;
	padding: 3px 6px;
	background: none;
	border: none;
	cursor: pointer;
	text-align: left;
	border-radius: 4px;
	font-size: 0.8rem;
}
.kiv-tree-node__label:hover {
	background: #e9ecef;
}
.kiv-tree-node__label--selected {
	background: #dbeafe;
	color: #1d4ed8;
}
.kiv-tree-node__type {
	font-weight: 600;
}
.kiv-tree-node__id {
	color: #6b7280;
	font-size: 0.7rem;
}
</style>
