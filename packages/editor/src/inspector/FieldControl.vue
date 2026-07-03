<script setup lang="ts">
import type { FieldDescriptor } from "@kiv/engine";
import BooleanControl from "./controls/BooleanControl.vue";
import ColorControl from "./controls/ColorControl.vue";
import NumberControl from "./controls/NumberControl.vue";
import SelectControl from "./controls/SelectControl.vue";
import TextareaControl from "./controls/TextareaControl.vue";
import TextControl from "./controls/TextControl.vue";

const props = defineProps<{
	fieldKey: string;
	descriptor: FieldDescriptor;
	modelValue: unknown;
}>();

const emit = defineEmits<{ "update:modelValue": [value: unknown] }>();

const label = props.descriptor.label ?? props.fieldKey;

const selectOptions =
	props.descriptor.options?.map((o) => String(o.value)) ?? [];
</script>

<template>
	<BooleanControl
		v-if="descriptor.control === 'boolean'"
		:label="label"
		:model-value="(modelValue as boolean | undefined)"
		@update:model-value="emit('update:modelValue', $event)"
	/>
	<ColorControl
		v-else-if="descriptor.control === 'color'"
		:label="label"
		:model-value="(modelValue as string | undefined)"
		@update:model-value="emit('update:modelValue', $event)"
	/>
	<SelectControl
		v-else-if="descriptor.control === 'select'"
		:label="label"
		:model-value="(modelValue as string | undefined)"
		:options="selectOptions"
		@update:model-value="emit('update:modelValue', $event)"
	/>
	<NumberControl
		v-else-if="descriptor.control === 'number'"
		:label="label"
		:model-value="(modelValue as number | undefined)"
		@update:model-value="emit('update:modelValue', $event)"
	/>
	<TextareaControl
		v-else-if="descriptor.control === 'textarea'"
		:label="label"
		:model-value="(modelValue as string | undefined)"
		@update:model-value="emit('update:modelValue', $event)"
	/>
	<TextControl
		v-else
		:label="label"
		:model-value="(modelValue as string | undefined)"
		@update:model-value="emit('update:modelValue', $event)"
	/>
</template>
