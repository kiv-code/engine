import type { EditorStore } from "../store/editor-store";

/** Nodes that support inline text editing and the prop they write to. */
const INLINE_FIELDS: Record<string, string> = {
	heading: "text",
	text: "content",
	button: "label",
};

interface Handlers {
	blur: EventListener;
	keydown: EventListener;
}

// WeakMap so handlers are GC'd with the element — no custom props on HTMLElement
const handlerMap = new WeakMap<HTMLElement, Handlers>();

/**
 * Activates inline editing when the user double-clicks a node in the canvas.
 * - Makes the element contenteditable
 * - On blur or Enter → commits via store.updateProps
 * - On Escape → reverts to original text
 */
export function useInlineEdit(store: EditorStore) {
	let currentEl: HTMLElement | null = null;
	let originalText = "";

	function commit(el: HTMLElement, nodeId: string, field: string) {
		const newText = el.innerText.trim();
		if (newText !== originalText) {
			store.updateProps(nodeId, { [field]: newText });
		}
		cleanup(el);
	}

	function cleanup(el: HTMLElement) {
		el.contentEditable = "false";
		el.removeAttribute("data-kiv-editing");
		el.style.outline = "";
		el.style.outlineOffset = "";
		const handlers = handlerMap.get(el);
		if (handlers) {
			el.removeEventListener("blur", handlers.blur);
			el.removeEventListener("keydown", handlers.keydown);
			handlerMap.delete(el);
		}
		currentEl = null;
	}

	function activate(el: HTMLElement, nodeId: string, field: string) {
		if (currentEl && currentEl !== el) {
			currentEl.contentEditable = "false";
			currentEl.removeAttribute("data-kiv-editing");
		}

		originalText = el.innerText.trim();
		el.contentEditable = "true";
		el.setAttribute("data-kiv-editing", "true");
		el.style.outline = "2px dashed #6366f1";
		el.style.outlineOffset = "2px";
		el.focus();

		// Place cursor at end
		const range = document.createRange();
		const sel = window.getSelection();
		range.selectNodeContents(el);
		range.collapse(false);
		sel?.removeAllRanges();
		sel?.addRange(range);

		currentEl = el;

		const blurHandler: EventListener = () => commit(el, nodeId, field);
		const keydownHandler: EventListener = (ev) => {
			const e = ev as KeyboardEvent;
			if (e.key === "Escape") {
				el.innerText = originalText;
				cleanup(el);
				e.preventDefault();
			} else if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				commit(el, nodeId, field);
			}
		};

		handlerMap.set(el, { blur: blurHandler, keydown: keydownHandler });
		el.addEventListener("blur", blurHandler);
		el.addEventListener("keydown", keydownHandler);
	}

	/** Call this from the canvas dblclick handler */
	function onCanvasDblClick(e: MouseEvent) {
		const target = (e.target as HTMLElement).closest(
			"[data-kiv-node-id]",
		) as HTMLElement | null;
		if (!target) return;

		const nodeId = target.dataset.kivNodeId;
		if (!nodeId) return;

		// Find the element with data-kiv-type (the actual rendered node element)
		const typeEl = (
			target.dataset.kivType ? target : target.querySelector("[data-kiv-type]")
		) as HTMLElement | null;
		const resolvedType = typeEl?.dataset.kivType ?? "";

		const field = INLINE_FIELDS[resolvedType];
		if (!field) return;

		store.select(nodeId);
		e.preventDefault();
		e.stopPropagation();

		activate(typeEl ?? target, nodeId, field);
	}

	/** Deactivates any active inline edit */
	function deactivate() {
		if (currentEl) {
			currentEl.contentEditable = "false";
			currentEl.removeAttribute("data-kiv-editing");
			currentEl = null;
		}
	}

	return { onCanvasDblClick, deactivate };
}
