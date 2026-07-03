<script setup lang="ts">
const props = defineProps<{
	label: string;
	modelValue?: string;
	options: string[];
}>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
	<label class="kiv-field">
		<span class="kiv-field__label">{{ props.label }}</span>
		<select
			class="kiv-field__select"
			:value="modelValue ?? ''"
			@change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
		>
			<option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
		</select>
	</label>
</template>
