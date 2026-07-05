<script setup lang="ts">
// Line-style SVG icons per node type — visually consistent (24x24 grid, 2px stroke).
// Used in the palette modal and the structure tree.
defineProps<{ type: string; size?: number }>();
</script>

<template>
	<svg
		:width="size ?? 18"
		:height="size ?? 18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="kiv-node-icon"
	>
		<!-- Page: document -->
		<template v-if="type === 'page'">
			<path d="M6 2h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
			<path d="M14 2v4h4" />
		</template>

		<!-- Section: full-width band -->
		<template v-else-if="type === 'section'">
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="M3 10h18" />
		</template>

		<!-- Container: centered box with side margins -->
		<template v-else-if="type === 'container'">
			<rect x="6" y="4" width="12" height="16" rx="1.5" />
			<path d="M3 4v16M21 4v16" opacity="0.45" />
		</template>

		<!-- Grid: 2x2 cells -->
		<template v-else-if="type === 'grid'">
			<rect x="3" y="3" width="8" height="8" rx="1" />
			<rect x="13" y="3" width="8" height="8" rx="1" />
			<rect x="3" y="13" width="8" height="8" rx="1" />
			<rect x="13" y="13" width="8" height="8" rx="1" />
		</template>

		<!-- Column: single vertical slot -->
		<template v-else-if="type === 'column'">
			<rect x="9" y="3" width="6" height="18" rx="1.5" />
		</template>

		<!-- Group (stack): stacked bars -->
		<template v-else-if="type === 'stack'">
			<rect x="4" y="4" width="16" height="4" rx="1.5" />
			<rect x="4" y="10" width="16" height="4" rx="1.5" />
			<rect x="4" y="16" width="16" height="4" rx="1.5" />
		</template>

		<!-- Heading: big H -->
		<template v-else-if="type === 'heading'">
			<path d="M6 4v16M18 4v16M6 12h12" />
		</template>

		<!-- Text: paragraph lines -->
		<template v-else-if="type === 'text'">
			<path d="M4 6h16M4 11h16M4 16h10" />
		</template>

		<!-- Button: rounded pill with a dot -->
		<template v-else-if="type === 'button'">
			<rect x="3" y="8" width="18" height="8" rx="4" />
			<path d="M8 12h6" opacity="0.6" />
		</template>

		<!-- Image: framed picture -->
		<template v-else-if="type === 'image'">
			<rect x="3" y="4" width="18" height="16" rx="2" />
			<circle cx="8.5" cy="9" r="1.5" />
			<path d="m21 16-5-5L5 20" />
		</template>

		<!-- Fallback: diamond -->
		<template v-else>
			<path d="M12 3l9 9-9 9-9-9 9-9Z" />
		</template>
	</svg>
</template>

<style scoped>
.kiv-node-icon {
	display: block;
	flex-shrink: 0;
}
</style>
