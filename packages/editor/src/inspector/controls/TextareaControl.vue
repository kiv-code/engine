<script setup lang="ts">
const props = defineProps<{ label: string; modelValue?: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
	<label class="kiv-field">
		<span class="kiv-field__label">{{ props.label }}</span>
		<textarea
			class="kiv-field__textarea"
			:value="modelValue ?? ''"
			rows="3"
			@input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
		/>
	</label>
</template>
