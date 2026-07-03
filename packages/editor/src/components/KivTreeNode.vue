<script setup lang="ts">
import type { KivNode } from "@kiv/engine";
import { inject } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";
import { getNodeIcon } from "../utils/node-icons";

const props = defineProps<{ node: KivNode; depth?: number }>();
const store = inject(EDITOR_STORE_KEY);

const allChildren = (node: KivNode): KivNode[] =>
	Object.values(node.slots ?? {}).flat();
</script>

<template>
	<div class="kiv-tree-node">
		<button
			class="kiv-tree-node__label"
			:class="{ 'kiv-tree-node__label--selected': store?.selected.value?.id === node.id }"
			:style="{ paddingLeft: `${8 + (depth ?? 0) * 14}px` }"
			type="button"
			@click="store?.select(node.id)"
		>
			<span class="kiv-tree-node__icon">{{ getNodeIcon(node.type) }}</span>
			<span class="kiv-tree-node__type">{{ node.type }}</span>
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
	padding-top: 4px;
	padding-bottom: 4px;
	padding-right: 8px;
	background: none;
	border: none;
	cursor: pointer;
	text-align: left;
	border-radius: 0;
	font-size: 0.8rem;
	white-space: nowrap;
	overflow: hidden;
	color: #374151;
}
.kiv-tree-node__label:hover {
	background: #f3f4f6;
}
.kiv-tree-node__label--selected {
	background: #eff6ff;
}
.kiv-tree-node__label--selected .kiv-tree-node__type {
	color: #1d4ed8;
}
.kiv-tree-node__icon {
	width: 16px;
	text-align: center;
	flex-shrink: 0;
	font-size: 0.75rem;
	color: #6b7280;
}
.kiv-tree-node__label--selected .kiv-tree-node__icon {
	color: #3b82f6;
}
.kiv-tree-node__type {
	font-weight: 500;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
