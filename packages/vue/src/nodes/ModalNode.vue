<script setup lang="ts">
import { BUTTON_RADIUS, BUTTON_SIZE, BUTTON_VARIANT } from "@kiv/nodes";
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { KIV_BUS_KEY } from "../bus";
import { KIV_EDITOR_MODE_KEY } from "../editor-mode";

declare module "@kiv/engine" {
	interface KivEventMap {
		"modal.opened": { nodeId?: string };
		"modal.closed": { nodeId?: string };
	}
}

const props = defineProps<{
	nodeId?: string;
	triggerType?: string;
	triggerLabel?: string;
	triggerStyle?: string;
	size?: string;
	closeOnOverlay?: boolean;
	closeOnEscape?: boolean;
	showCloseButton?: boolean;
	preventScroll?: boolean;
	animation?: string;
}>();

const bus = inject(KIV_BUS_KEY, null);
const isEditorMode = inject(KIV_EDITOR_MODE_KEY, false);

const open = ref(false);

function openModal(): void {
	if (isEditorMode) return;
	open.value = true;
	bus?.emit("modal.opened", { nodeId: props.nodeId });
}

function closeModal(): void {
	if (!open.value) return;
	open.value = false;
	bus?.emit("modal.closed", { nodeId: props.nodeId });
}

function onOverlayClick(): void {
	if (props.closeOnOverlay !== false) closeModal();
}

function onKeydown(e: KeyboardEvent): void {
	if (e.key === "Escape" && props.closeOnEscape !== false) closeModal();
}

watch(open, (isOpen) => {
	if (typeof document === "undefined") return;
	if (isOpen && props.preventScroll !== false) {
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = "";
	}
});
onBeforeUnmount(() => {
	if (typeof document !== "undefined") document.body.style.overflow = "";
});

const triggerTag = computed(() => {
	if (props.triggerType === "link") return "a";
	if (props.triggerType === "button" || props.triggerType === undefined)
		return "button";
	return "span";
});

const triggerButtonStyle = computed(() => {
	const variant =
		BUTTON_VARIANT[props.triggerStyle ?? "primary"] ?? BUTTON_VARIANT.primary;
	const sizing = BUTTON_SIZE.md;
	return {
		display: "inline-block" as const,
		padding: sizing?.padding,
		fontSize: sizing?.fontSize,
		fontWeight: "600",
		borderRadius: BUTTON_RADIUS.md ?? "6px",
		background: variant?.background,
		color: variant?.color,
		border: variant?.border,
		cursor: isEditorMode ? "default" : "pointer",
		textDecoration: variant?.textDecoration ?? "none",
	};
});

const sizeStyle = computed(() => {
	const widths: Record<string, string> = {
		sm: "400px",
		md: "560px",
		lg: "760px",
		xl: "960px",
		full: "100vw",
		auto: "auto",
	};
	return {
		width: widths[props.size ?? "md"] ?? widths.md,
		height: props.size === "full" ? "100vh" : undefined,
		borderRadius: props.size === "full" ? "0" : "12px",
	};
});

const transitionName = computed(() => `kiv-modal-${props.animation ?? "fade"}`);
</script>

<template>
	<component :is="triggerTag" :style="triggerButtonStyle" data-kiv-modal-trigger @click="openModal">
		{{ triggerLabel ?? "Open" }}
	</component>

	<Teleport to="body">
		<Transition :name="transitionName">
			<div
				v-if="open"
				class="kiv-modal__backdrop"
				data-kiv-type="modal"
				role="dialog"
				aria-modal="true"
				@click.self="onOverlayClick"
				@keydown="onKeydown"
			>
				<div class="kiv-modal__panel" :style="sizeStyle">
					<button
						v-if="showCloseButton !== false"
						type="button"
						class="kiv-modal__close"
						aria-label="Close"
						@click="closeModal"
					>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
					</button>
					<div class="kiv-modal__content">
						<slot />
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.kiv-modal__backdrop {
	position: fixed;
	inset: 0;
	z-index: 9998;
	background: rgba(0, 0, 0, 0.55);
	display: flex;
	align-items: center;
	justify-content: center;
}
.kiv-modal__panel {
	position: relative;
	max-width: calc(100vw - 32px);
	max-height: calc(100vh - 32px);
	overflow: auto;
	background: #fff;
	box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}
.kiv-modal__close {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 26px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 6px;
	background: rgba(15, 23, 42, 0.06);
	color: #0f172a;
	cursor: pointer;
	z-index: 1;
}
.kiv-modal__content {
	padding: 24px;
}

.kiv-modal-fade-enter-active,
.kiv-modal-fade-leave-active { transition: opacity 0.15s ease; }
.kiv-modal-fade-enter-from,
.kiv-modal-fade-leave-to { opacity: 0; }

.kiv-modal-zoom-enter-active,
.kiv-modal-zoom-leave-active { transition: opacity 0.15s ease; }
.kiv-modal-zoom-enter-active .kiv-modal__panel,
.kiv-modal-zoom-leave-active .kiv-modal__panel { transition: transform 0.15s ease; }
.kiv-modal-zoom-enter-from,
.kiv-modal-zoom-leave-to { opacity: 0; }
.kiv-modal-zoom-enter-from .kiv-modal__panel,
.kiv-modal-zoom-leave-to .kiv-modal__panel { transform: scale(0.92); }

.kiv-modal-slide-up-enter-active,
.kiv-modal-slide-up-leave-active { transition: opacity 0.15s ease; }
.kiv-modal-slide-up-enter-active .kiv-modal__panel,
.kiv-modal-slide-up-leave-active .kiv-modal__panel { transition: transform 0.18s ease; }
.kiv-modal-slide-up-enter-from,
.kiv-modal-slide-up-leave-to { opacity: 0; }
.kiv-modal-slide-up-enter-from .kiv-modal__panel,
.kiv-modal-slide-up-leave-to .kiv-modal__panel { transform: translateY(24px); }

.kiv-modal-slide-down-enter-active,
.kiv-modal-slide-down-leave-active { transition: opacity 0.15s ease; }
.kiv-modal-slide-down-enter-active .kiv-modal__panel,
.kiv-modal-slide-down-leave-active .kiv-modal__panel { transition: transform 0.18s ease; }
.kiv-modal-slide-down-enter-from,
.kiv-modal-slide-down-leave-to { opacity: 0; }
.kiv-modal-slide-down-enter-from .kiv-modal__panel,
.kiv-modal-slide-down-leave-to .kiv-modal__panel { transform: translateY(-24px); }

.kiv-modal-none-enter-active,
.kiv-modal-none-leave-active { transition: none; }
</style>
