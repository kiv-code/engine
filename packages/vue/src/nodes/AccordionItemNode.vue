<script setup lang="ts">
import { RADIUS } from "@kiv/nodes";
import { computed, inject, onBeforeUnmount, onMounted } from "vue";
import { KIV_EDITOR_MODE_KEY } from "../editor-mode";
import { ACCORDION_CONTEXT_KEY } from "./accordion-context";

let uidCounter = 0;

const props = defineProps<{
	nodeId?: string;
	title?: string;
	defaultOpen?: boolean;
	disabled?: boolean;
	icon?: string;
	background?: string;
	titleColor?: string;
}>();

const ctx = inject(ACCORDION_CONTEXT_KEY, null);
const isEditorMode = inject(KIV_EDITOR_MODE_KEY, false);

const id = props.nodeId ?? `accordion-item-${uidCounter++}`;

onMounted(() => {
	ctx?.register(id, props.defaultOpen === true);
});
onBeforeUnmount(() => {
	ctx?.unregister(id);
});

// Editor mode keeps items expanded so their content stays selectable/editable.
const isOpen = computed(
	() => isEditorMode || (ctx ? ctx.isOpen(id) : props.defaultOpen === true),
);

function onToggle(): void {
	if (isEditorMode) return;
	ctx?.toggle(id, props.disabled);
}

const wrapStyle = computed(() => ({
	background:
		props.background && props.background !== "transparent"
			? props.background
			: undefined,
	borderRadius: RADIUS.sm ?? "4px",
	overflow: "hidden" as const,
}));

const headerStyle = computed(() => ({
	display: "flex" as const,
	alignItems: "center" as const,
	justifyContent: "space-between" as const,
	gap: "8px",
	padding: "12px 16px",
	cursor: props.disabled ? "not-allowed" : "pointer",
	color: props.titleColor || undefined,
	fontWeight: 600,
	opacity: props.disabled ? 0.5 : 1,
	flexDirection:
		(ctx?.iconPosition.value ?? "right") === "left"
			? ("row-reverse" as const)
			: ("row" as const),
}));

const bodyStyle = computed(() => ({
	display: "grid" as const,
	gridTemplateRows: isOpen.value ? "1fr" : "0fr",
	overflow: "hidden" as const,
	transition:
		(ctx?.animation.value ?? "slide") === "none"
			? undefined
			: `grid-template-rows ${ctx?.animationDuration.value ?? 200}ms ease`,
}));

const iconKind = computed(() => ctx?.icon.value ?? "chevron");
</script>

<template>
	<div :style="wrapStyle" data-kiv-type="accordion-item">
		<div
			role="button"
			tabindex="0"
			:aria-expanded="isOpen"
			:style="headerStyle"
			@click="onToggle"
			@keydown.enter="onToggle"
			@keydown.space.prevent="onToggle"
		>
			<span>{{ title }}</span>
			<span
				class="kiv-accordion-item__icon"
				:class="{ 'kiv-accordion-item__icon--open': isOpen }"
			>
				<svg v-if="iconKind === 'chevron'" width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<svg v-else-if="iconKind === 'plus'" width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
				</svg>
				<svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M1 6h9M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</span>
		</div>
		<div :style="bodyStyle">
			<div style="min-height: 0; overflow: hidden; padding: 0 16px 16px;">
				<slot />
			</div>
		</div>
	</div>
</template>

<style scoped>
.kiv-accordion-item__icon {
	display: inline-flex;
	transition: transform 0.2s ease;
}
.kiv-accordion-item__icon--open {
	transform: rotate(180deg);
}
</style>
