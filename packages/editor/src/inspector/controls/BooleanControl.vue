<script setup lang="ts">
const props = defineProps<{ label: string; modelValue?: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<template>
	<label class="kiv-field kiv-field--boolean">
		<input
			type="checkbox"
			class="kiv-field__checkbox"
			:checked="modelValue ?? false"
			@change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
		/>
		<span class="kiv-field__label">{{ props.label }}</span>
	</label>
</template>
