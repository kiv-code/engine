<script setup lang="ts">
const props = defineProps<{ label: string; modelValue?: number }>();
const emit = defineEmits<{ "update:modelValue": [value: number] }>();
</script>

<template>
	<label class="kiv-field">
		<span class="kiv-field__label">{{ props.label }}</span>
		<input
			type="number"
			class="kiv-field__input"
			:value="modelValue ?? 0"
			step="0.1"
			@input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
		/>
	</label>
</template>
