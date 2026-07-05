<script setup lang="ts">
defineProps<{ modelValue?: string; options: string[] }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
	<div class="kiv-select-wrap">
		<select
			class="kiv-select"
			:value="modelValue ?? ''"
			@change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
		>
			<option v-if="!modelValue" value="" disabled>—</option>
			<option
				v-for="opt in options"
				:key="opt"
				:value="opt"
			>{{ opt }}</option>
		</select>
		<svg class="kiv-select__chevron" width="10" height="10" viewBox="0 0 10 10" fill="none">
			<path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</div>
</template>

<style scoped>
.kiv-select-wrap {
	position: relative;
}
.kiv-select {
	width: 100%;
	appearance: none;
	background: var(--color-surface-sunken);
	border: 1px solid var(--color-border);
	border-radius: 6px;
	padding: 6px 28px 6px 10px;
	font-size: 0.78rem;
	font-family: inherit;
	color: var(--color-text-primary);
	cursor: pointer;
	outline: none;
	transition: border-color 0.12s;
}
.kiv-select:hover { border-color: #3d4166; }
.kiv-select:focus { border-color: var(--color-accent); }
.kiv-select__chevron {
	position: absolute;
	right: 9px;
	top: 50%;
	transform: translateY(-50%);
	color: var(--color-text-muted);
	pointer-events: none;
}
</style>
