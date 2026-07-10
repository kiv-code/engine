<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, watch } from "vue";
import { KIV_EDITOR_MODE_KEY } from "../editor-mode";
import { TABS_CONTEXT_KEY } from "./tabs-context";

let uidCounter = 0;

const props = defineProps<{
	nodeId?: string;
	title?: string;
	icon?: string;
	badge?: string;
	badgeColor?: string;
	disabled?: boolean;
}>();

const ctx = inject(TABS_CONTEXT_KEY, null);
const isEditorMode = inject(KIV_EDITOR_MODE_KEY, false);

const id = props.nodeId ?? `tab-panel-${uidCounter++}`;

function meta() {
	return {
		title: props.title ?? "",
		icon: props.icon,
		badge: props.badge,
		badgeColor: props.badgeColor,
		disabled: props.disabled === true,
	};
}

onMounted(() => {
	ctx?.register({ id, ...meta() });
});
onBeforeUnmount(() => {
	ctx?.unregister(id);
});

watch(
	() => [
		props.title,
		props.icon,
		props.badge,
		props.badgeColor,
		props.disabled,
	],
	() => ctx?.update(id, meta()),
);

// Editor mode always shows the panel so its content stays selectable/editable.
const isActive = computed(() => isEditorMode || ctx?.activeId.value === id);
</script>

<template>
	<section v-show="isActive" data-kiv-type="tab-panel">
		<slot />
	</section>
</template>
