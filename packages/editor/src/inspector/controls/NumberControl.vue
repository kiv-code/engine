<script setup lang="ts">
defineProps<{ modelValue?: number }>();
defineEmits<{ "update:modelValue": [value: number] }>();
</script>

<template>
	<input
		type="number"
		class="kiv-input"
		:value="modelValue ?? ''"
		step="1"
		@input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
	/>
</template>
