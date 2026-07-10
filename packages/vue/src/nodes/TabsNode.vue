<script setup lang="ts">
import { computed, inject, onMounted, provide, ref } from "vue";
import { KIV_BUS_KEY } from "../bus";
import {
	TABS_CONTEXT_KEY,
	type TabPanelMeta,
	type TabsContext,
} from "./tabs-context";

declare module "@kiv/engine" {
	interface KivEventMap {
		"tabs.tabChanged": {
			nodeId?: string;
			currentIndex: number;
			currentTitle: string;
		};
	}
}

const props = defineProps<{
	nodeId?: string;
	defaultTab?: number;
	orientation?: string;
	position?: string;
	style?: string;
	animation?: string;
	stretch?: boolean;
	fullWidth?: boolean;
}>();

const bus = inject(KIV_BUS_KEY, null);

const activeId = ref<string | null>(null);
const panels = ref<TabPanelMeta[]>([]);

function setActive(id: string): void {
	const index = panels.value.findIndex((p) => p.id === id);
	const panel = panels.value[index];
	if (!panel || panel.disabled || activeId.value === id) return;
	activeId.value = id;
	bus?.emit("tabs.tabChanged", {
		nodeId: props.nodeId,
		currentIndex: index,
		currentTitle: panel.title,
	});
}

function register(meta: TabPanelMeta): void {
	panels.value = [...panels.value, meta];
}

function update(id: string, patch: Partial<Omit<TabPanelMeta, "id">>): void {
	panels.value = panels.value.map((p) =>
		p.id === id ? { ...p, ...patch } : p,
	);
}

function unregister(id: string): void {
	panels.value = panels.value.filter((p) => p.id !== id);
	if (activeId.value === id) activeId.value = null;
}

onMounted(() => {
	if (activeId.value || panels.value.length === 0) return;
	const idx = props.defaultTab ?? 0;
	const preferred = panels.value[idx] ?? panels.value[0];
	if (preferred) activeId.value = preferred.id;
});

const context: TabsContext = {
	activeId,
	setActive,
	register,
	update,
	unregister,
	panels,
};
provide(TABS_CONTEXT_KEY, context);

const isVertical = computed(() => props.orientation === "vertical");
const wrapStyle = computed(() => ({
	display: "flex" as const,
	flexDirection: isVertical.value ? ("row" as const) : ("column" as const),
	gap: "12px",
}));
const tablistStyle = computed(() => ({
	display: "flex" as const,
	flexDirection: isVertical.value ? ("column" as const) : ("row" as const),
	gap: "4px",
	flexWrap: "wrap" as const,
	borderBottom:
		props.style === "underline" && !isVertical.value
			? "1px solid #e2e8f0"
			: undefined,
}));

function tabButtonStyle(panel: TabPanelMeta) {
	const isActive = panel.id === activeId.value;
	const base: Record<string, string | undefined> = {
		flex: props.stretch || props.fullWidth ? "1" : undefined,
		padding: "8px 14px",
		border: "none",
		background: "transparent",
		cursor: panel.disabled ? "not-allowed" : "pointer",
		opacity: panel.disabled ? "0.5" : "1",
		fontWeight: isActive ? "700" : "500",
		fontSize: "0.85rem",
	};
	if (props.style === "pills") {
		base.borderRadius = "9999px";
		base.background = isActive ? "#6366f1" : "#f1f5f9";
		base.color = isActive ? "#fff" : "#0f172a";
	} else if (props.style === "buttons") {
		base.borderRadius = "8px";
		base.background = isActive ? "#eef2ff" : "transparent";
		base.border = "1px solid #e2e8f0";
	} else {
		base.borderBottom = isActive
			? "2px solid #6366f1"
			: "2px solid transparent";
		base.color = isActive ? "#6366f1" : "#334155";
	}
	return base;
}
</script>

<template>
	<div :style="wrapStyle" data-kiv-type="tabs">
		<div role="tablist" :style="tablistStyle">
			<button
				v-for="panel in panels"
				:key="panel.id"
				type="button"
				role="tab"
				:aria-selected="panel.id === activeId"
				:disabled="panel.disabled"
				:style="tabButtonStyle(panel)"
				@click="setActive(panel.id)"
			>
				{{ panel.title }}
				<span v-if="panel.badge" :style="{ marginLeft: '6px', color: panel.badgeColor || undefined }">{{ panel.badge }}</span>
			</button>
		</div>
		<div class="kiv-tabs__panels" style="flex: 1; min-width: 0;">
			<slot />
		</div>
	</div>
</template>
