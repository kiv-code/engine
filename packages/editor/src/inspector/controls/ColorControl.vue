<script setup lang="ts">
defineProps<{ modelValue?: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
	<div class="kiv-color">
		<div class="kiv-color__swatch">
			<input
				type="color"
				class="kiv-color__input"
				:value="modelValue ?? '#000000'"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			/>
			<span class="kiv-color__preview" :style="{ background: modelValue ?? '#000000' }" />
		</div>
		<input
			type="text"
			class="kiv-input kiv-color__text"
			:value="modelValue ?? ''"
			@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
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
