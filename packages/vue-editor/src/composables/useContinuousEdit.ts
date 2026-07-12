import { onBeforeUnmount } from "vue";
import type { EditorStore } from "../store/editor-store";

/**
 * Collapses a continuous drag/pick gesture (range slider, color picker) into
 * a single history entry instead of one per `input` tick. Call `start()` on
 * the first tick of a gesture and `end()` when it commits (native `change`
 * event, which range/color inputs fire exactly once, on release).
 *
 * Wire any future continuous control the same way: inject the store, call
 * `start()` from the shared mutation function, add one `@change="end"` on
 * the control's root element.
 */
export function useContinuousEdit(store: EditorStore | null | undefined) {
	let active = false;

	function end(): void {
		if (!active) return;
		active = false;
		window.removeEventListener("blur", end);
		store?.endBatch();
	}

	function start(): void {
		if (active || !store) return;
		active = true;
		store.startBatch();
		window.addEventListener("blur", end, { once: true });
	}

	onBeforeUnmount(end);

	return { start, end };
}
