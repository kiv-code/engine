import { onBeforeUnmount, ref } from "vue";

export interface ResizablePanelOptions {
	storageKey: string;
	defaultWidth: number;
	min: number;
	max: number;
	/** Which edge the drag handle sits on — determines the sign of the drag delta. */
	edge: "left" | "right";
}

/** Drag-to-resize a fixed-width side panel, with the chosen width persisted to localStorage. */
export function useResizablePanel(opts: ResizablePanelOptions) {
	const clamp = (w: number) => Math.min(opts.max, Math.max(opts.min, w));

	const stored =
		typeof localStorage !== "undefined"
			? Number(localStorage.getItem(opts.storageKey))
			: Number.NaN;
	const width = ref(
		Number.isFinite(stored) && stored > 0 ? clamp(stored) : opts.defaultWidth,
	);

	let startX = 0;
	let startWidth = 0;

	function onMouseMove(e: MouseEvent) {
		const delta = e.clientX - startX;
		width.value = clamp(startWidth + (opts.edge === "right" ? delta : -delta));
	}

	function onMouseUp() {
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
		document.body.style.userSelect = "";
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(opts.storageKey, String(width.value));
		}
	}

	function startResize(e: MouseEvent) {
		startX = e.clientX;
		startWidth = width.value;
		document.body.style.userSelect = "none";
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	}

	onBeforeUnmount(() => {
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	});

	return { width, startResize };
}
