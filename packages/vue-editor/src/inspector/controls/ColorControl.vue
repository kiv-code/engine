<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const safeColor = computed(() => {
	const v = props.modelValue;
	if (!v || !/^#[0-9a-fA-F]{6}$/.test(v)) return "#000000";
	return v;
});
</script>

<template>
	<div class="kiv-color">
		<div class="kiv-color__swatch">
			<input
				type="color"
				class="kiv-color__input"
				:value="safeColor"
				@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			/>
			<span class="kiv-color__preview" :style="{ background: safeColor }" />
		</div>
		<input
			type="text"
			class="kiv-input kiv-color__text"
			:value="modelValue ?? ''"
			@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		/>
	</div>
</template>

<style scoped>
.kiv-color {
	display: flex;
	align-items: center;
	gap: 8px;
}
.kiv-color__swatch {
	position: relative;
	width: 28px;
	height: 28px;
	flex-shrink: 0;
	border-radius: 5px;
	border: 1px solid var(--color-border);
	overflow: hidden;
}
.kiv-color__input {
	position: absolute;
	inset: 0;
	opacity: 0;
	cursor: pointer;
	width: 100%;
	height: 100%;
	padding: 0;
	border: none;
}
.kiv-color__preview {
	display: block;
	width: 100%;
	height: 100%;
}
.kiv-color__text {
	flex: 1;
	min-width: 0;
	font-family: monospace;
}
</style>
