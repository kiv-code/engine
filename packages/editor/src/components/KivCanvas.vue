<script setup lang="ts">
import type { VueRegistry } from "@kiv/vue";
import { KivRenderer } from "@kiv/vue";
import { inject } from "vue";
import { EDITOR_STORE_KEY } from "../store/context";

defineProps<{ registry: VueRegistry }>();

const store = inject(EDITOR_STORE_KEY);
</script>

<template>
	<div class="kiv-canvas">
		<KivRenderer
			v-if="store"
			:document="store.document.value"
			:registry="registry"
		/>
	</div>
</template>

<style scoped>
.kiv-canvas {
	flex: 1;
	overflow: auto;
	background: #f8f9fa;
	padding: 1rem;
}
</style>
