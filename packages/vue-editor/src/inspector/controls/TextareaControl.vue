<script setup lang="ts">
defineProps<{ modelValue?: string; placeholder?: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
	<textarea
		rows="3"
		class="kiv-input"
		style="resize: vertical;"
		:value="modelValue ?? ''"
		:placeholder="placeholder ?? ''"
		@input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
	/>
</template>
