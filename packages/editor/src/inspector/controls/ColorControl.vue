<script setup lang="ts">
const props = defineProps<{ label: string; modelValue?: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
	<label class="kiv-field kiv-field--color">
		<span class="kiv-field__label">{{ props.label }}</span>
		<div class="kiv-field__color-row">
			<input
				type="color"
				class="kiv-field__color-swatch"
				:value="modelValue ?? '#000000'"
				@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			/>
			<input
				type="text"
				class="kiv-field__input"
				:value="modelValue ?? ''"
				@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			/>
		</div>
	</label>
</template>
