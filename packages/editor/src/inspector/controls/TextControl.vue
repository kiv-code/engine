<script setup lang="ts">
const props = defineProps<{ label: string; modelValue?: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
	<label class="kiv-field">
		<span class="kiv-field__label">{{ props.label }}</span>
		<input
			type="text"
			class="kiv-field__input"
			:value="modelValue ?? ''"
			@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		/>
	</label>
</template>
