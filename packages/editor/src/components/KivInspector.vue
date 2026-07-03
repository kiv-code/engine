<script setup lang="ts">
import type { Registry } from "@kiv/engine";
import { inject } from "vue";
import FieldControl from "../inspector/FieldControl.vue";
import { EDITOR_STORE_KEY } from "../store/context";

const props = defineProps<{ registry: Registry }>();
const store = inject(EDITOR_STORE_KEY);
</script>

<template>
	<aside class="kiv-inspector">
		<div class="kiv-inspector__header">Inspector</div>
		<div v-if="!store?.selected.value" class="kiv-inspector__empty">
			Select a node to inspect
		</div>
		<template v-else>
			<div class="kiv-inspector__node-type">{{ store.selected.value.type }}</div>
			<div class="kiv-inspector__fields">
				<template v-if="props.registry.has(store.selected.value.type)">
					<FieldControl
						v-for="(descriptor, key) in props.registry.get(store.selected.value.type)!.fields"
						:key="key"
						:field-key="key"
						:descriptor="descriptor"
						:model-value="store.selected.value.props[key]"
						@update:model-value="store.updateProps(store.selected.value!.id, { [key]: $event })"
					/>
				</template>
			</div>
		</template>
	</aside>
</template>

<style scoped>
.kiv-inspector {
	width: 260px;
	border-left: 1px solid #e5e7eb;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.kiv-inspector__header {
	padding: 8px 12px;
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: #6b7280;
	border-bottom: 1px solid #e5e7eb;
}
.kiv-inspector__empty {
	padding: 16px 12px;
	color: #9ca3af;
	font-size: 0.85rem;
}
.kiv-inspector__node-type {
	padding: 8px 12px;
	font-weight: 600;
	font-size: 0.85rem;
	border-bottom: 1px solid #e5e7eb;
}
.kiv-inspector__fields {
	flex: 1;
	overflow-y: auto;
	padding: 8px 12px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
