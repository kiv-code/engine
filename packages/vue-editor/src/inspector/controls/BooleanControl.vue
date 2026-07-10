<script setup lang="ts">
defineProps<{ label: string; modelValue?: boolean; bpBadge?: string }>();
defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<template>
	<div
		class="kiv-bool"
		@click="$emit('update:modelValue', !modelValue)"
	>
		<div class="kiv-bool__left">
			<span class="kiv-bool__label">{{ label }}</span>
			<span v-if="bpBadge" class="kiv-bool__badge">{{ bpBadge }}</span>
		</div>
		<div
			class="kiv-bool__track"
			:class="{ 'kiv-bool__track--on': modelValue }"
		>
			<span class="kiv-bool__thumb" />
		</div>
	</div>
</template>

<style scoped>
.kiv-bool {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 7px 10px;
	background: var(--color-surface-sunken);
	border: 1px solid var(--color-border);
	border-radius: 6px;
	cursor: pointer;
	user-select: none;
}
.kiv-bool:hover { border-color: #3d4166; }
.kiv-bool__left {
	display: flex;
	align-items: center;
	gap: 6px;
	min-width: 0;
}
.kiv-bool__label {
	font-size: 0.75rem;
	color: var(--color-text-secondary);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.kiv-bool__badge {
	font-size: 0.55rem;
	font-weight: 700;
	padding: 1px 5px;
	border-radius: 3px;
	background: var(--color-accent-muted);
	color: var(--color-accent-light);
	flex-shrink: 0;
}
.kiv-bool__track {
	position: relative;
	width: 36px;
	height: 20px;
	flex-shrink: 0;
	border-radius: 10px;
	background: var(--color-track, var(--color-border));
	transition: background 0.2s;
}
.kiv-bool__track--on {
	background: var(--color-accent, #6366f1);
}
.kiv-bool__thumb {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #fff;
	box-shadow: 0 1px 3px rgba(0,0,0,0.3);
	transition: transform 0.2s;
}
.kiv-bool__track--on .kiv-bool__thumb {
	transform: translateX(16px);
}
</style>
