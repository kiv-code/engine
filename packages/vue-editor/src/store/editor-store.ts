import type {
	Breakpoint,
	EventBus,
	KivDocument,
	KivNode,
	Registry,
	Responsive,
} from "@kiv/engine";
import { EditorEngine } from "@kiv/engine";
import { computed, ref } from "vue";

const HISTORY_LIMIT = 50;

export interface EditorStoreOptions {
	/** Shared bus (e.g. `engine.bus`) so plugins can observe editor mutations. Creates its own if omitted. */
	bus?: EventBus;
}

export interface EditorStore {
	document: Readonly<{ value: KivDocument }>;
	selected: Readonly<{ value: KivNode | null }>;
	canUndo: Readonly<{ value: boolean }>;
	canRedo: Readonly<{ value: boolean }>;
	breakpoint: Readonly<{ value: Breakpoint }>;
	locale: Readonly<{ value: string }>;
	select(id: string | null): void;
	setBreakpoint(bp: Breakpoint): void;
	setLocale(locale: string): void;
	updateProps(id: string, patch: Record<string, unknown>): void;
	renameNode(id: string, newId: string): void;
	canUseId(id: string): boolean;
	addNode(
		parentId: string,
		slotName: string,
		node: KivNode,
		index?: number,
	): void;
	removeNode(id: string): void;
	duplicateNode(id: string): void;
	moveNode(
		id: string,
		targetParentId: string,
		targetSlot: string,
		targetIndex: number,
	): void;
	setLocked(id: string, locked: boolean): void;
	setVisible(id: string, visible: Responsive<boolean>): void;
	undo(): void;
	redo(): void;
}

/** Vue wrapper around the framework-agnostic `EditorEngine` — bridges its bus into Vue refs. */
export function useEditorStore(
	initialDocument: KivDocument,
	_registry: Registry,
	options: EditorStoreOptions = {},
): EditorStore {
	const engine = new EditorEngine(initialDocument, {
		historyLimit: HISTORY_LIMIT,
		bus: options.bus,
	});

	const document = ref<KivDocument>(engine.document);
	const canUndo = ref(engine.canUndo);
	const canRedo = ref(engine.canRedo);
	const selectedId = ref<string | null>(null);
	const breakpoint = ref<Breakpoint>("lg");
	const locale = ref<string>(initialDocument.i18n?.default ?? "en");

	engine.bus.on("history.changed", (state) => {
		document.value = engine.document;
		canUndo.value = state.canUndo;
		canRedo.value = state.canRedo;
	});

	engine.bus.on("selection.changed", (state) => {
		selectedId.value = state.ids[0] ?? null;
	});

	const selected = computed<KivNode | null>(() => {
		const id = selectedId.value;
		void document.value;
		if (!id) return null;
		return engine.findNode(id)?.node ?? null;
	});

	function select(id: string | null) {
		if (id === null) engine.selection.clear();
		else engine.selection.select(id);
	}

	function setBreakpoint(bp: Breakpoint) {
		breakpoint.value = bp;
	}

	function setLocale(next: string) {
		locale.value = next;
	}

	function updateProps(id: string, patch: Record<string, unknown>) {
		engine.updateNodeProps(id, patch);
	}

	function rename(id: string, newId: string) {
		engine.renameNode(id, newId);
	}

	function canUseId(id: string): boolean {
		return engine.canUseId(id, selectedId.value ?? undefined);
	}

	function add(
		parentId: string,
		slotName: string,
		node: KivNode,
		index?: number,
	) {
		engine.addNode({ parentId, slot: slotName, node, index });
	}

	function remove(id: string) {
		engine.removeNode(id);
	}

	function duplicate(id: string) {
		engine.duplicateNode(id);
	}

	function move(
		id: string,
		targetParentId: string,
		targetSlot: string,
		targetIndex: number,
	) {
		engine.moveNode({ id, targetParentId, targetSlot, targetIndex });
	}

	function setLocked(id: string, locked: boolean) {
		engine.setNodeFlags(id, { locked });
	}

	function setVisible(id: string, visible: Responsive<boolean>) {
		engine.setNodeFlags(id, { visible });
	}

	function undo() {
		engine.undo();
	}

	function redo() {
		engine.redo();
	}

	return {
		document,
		selected,
		canUndo,
		canRedo,
		breakpoint,
		locale,
		select,
		setBreakpoint,
		setLocale,
		updateProps,
		renameNode: rename,
		canUseId,
		addNode: add,
		removeNode: remove,
		duplicateNode: duplicate,
		moveNode: move,
		setLocked,
		setVisible,
		undo,
		redo,
	};
}
