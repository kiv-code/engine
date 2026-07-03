<script setup lang="ts">
import type { FieldDescriptor, Registry } from "@kiv/engine";
import { computed, inject } from "vue";
import FieldControl from "../inspector/FieldControl.vue";
import { EDITOR_STORE_KEY } from "../store/context";

const props = defineProps<{ registry: Registry }>();
const store = inject(EDITOR_STORE_KEY);

const GROUP_ORDER = [
	"Layout",
	"Typography",
	"Content",
	"Background",
	"Overlay",
	"Effects",
	"Border",
	"Link",
	"Style",
	"General",
];

interface GroupedField {
	key: string;
	descriptor: FieldDescriptor;
}

const groupedFields = computed(() => {
	const node = store?.selected.value;
	if (!node || !props.registry.has(node.type)) return [];

	const compiled = props.registry.get(node.type);
	if (!compiled) return [];
	const groups = new Map<string, GroupedField[]>();

	for (const [key, descriptor] of Object.entries(compiled.fields)) {
		const g = descriptor.group ?? "General";
		if (!groups.has(g)) groups.set(g, []);
		groups.get(g)?.push({ key, descriptor });
	}

	return GROUP_ORDER.filter((g) => groups.has(g)).map((g) => ({
		name: g,
		fields: groups.get(g) ?? [],
	}));
});
</script>

<template>
	<aside class="kiv-inspector">
		<div class="kiv-inspector__header">Inspector</div>
		<div v-if="!store?.selected.value" class="kiv-inspector__empty">
			Select a node to inspect
		</div>
		<template v-else>
			<div class="kiv-inspector__node-type">
				<span class="kiv-inspector__node-badge">{{ store.selected.value.type }}</span>
			</div>
			<div class="kiv-inspector__groups">
				<details
					v-for="group in groupedFields"
					:key="group.name"
					class="kiv-inspector__group"
					open
				>
					<summary class="kiv-inspector__group-title">{{ group.name }}</summary>
					<div class="kiv-inspector__group-fields">
						<FieldControl
							v-for="field in group.fields"
							:key="field.key"
							:field-key="field.key"
							:descriptor="field.descriptor"
							:model-value="store.selected.value!.props[field.key]"
							@update:model-value="store.updateProps(store.selected.value!.id, { [field.key]: $event })"
						/>
					</div>
				</details>
			</div>
		</template>
	</aside>
</template>

<style scoped>
.kiv-inspector {
	width: 260px;
	min-width: 260px;
	flex-shrink: 0;
	border-left: 1px solid #e5e7eb;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: #fff;
}
.kiv-inspector__header {
	padding: 8px 12px;
	font-size: 0.7rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #6b7280;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}
.kiv-inspector__empty {
	padding: 24px 12px;
	color: #9ca3af;
	font-size: 0.8rem;
	text-align: center;
}
.kiv-inspector__node-type {
	padding: 8px 12px;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}
.kiv-inspector__node-badge {
	display: inline-block;
	padding: 2px 8px;
	background: #1d4ed8;
	color: #fff;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 600;
}
.kiv-inspector__groups {
	flex: 1;
	overflow-y: auto;
}
.kiv-inspector__group {
	border-bottom: 1px solid #e5e7eb;
}
.kiv-inspector__group-title {
	padding: 6px 12px;
	font-size: 0.7rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: #6b7280;
	cursor: pointer;
	user-select: none;
	background: #f9fafb;
	list-style: none;
	display: flex;
	align-items: center;
	gap: 4px;
}
.kiv-inspector__group-title::-webkit-details-marker {
	display: none;
}
.kiv-inspector__group-title::before {
	content: "›";
	display: inline-block;
	transition: transform 0.15s;
	font-size: 1rem;
	color: #9ca3af;
}
details[open] .kiv-inspector__group-title::before {
	transform: rotate(90deg);
}
.kiv-inspector__group-fields {
	padding: 8px 12px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
