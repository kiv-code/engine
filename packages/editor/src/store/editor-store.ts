import type { Breakpoint, KivDocument, KivNode, Registry } from "@kiv/engine";
import { computed, ref } from "vue";
import {
	addNode,
	cloneDocument,
	moveNode,
	removeNode,
	updateNodeProps,
} from "../utils/document-ops";

const HISTORY_LIMIT = 50;

export interface EditorStore {
	document: Readonly<{ value: KivDocument }>;
	selected: Readonly<{ value: KivNode | null }>;
	canUndo: Readonly<{ value: boolean }>;
	canRedo: Readonly<{ value: boolean }>;
	breakpoint: Readonly<{ value: Breakpoint }>;
	select(id: string | null): void;
	setBreakpoint(bp: Breakpoint): void;
	updateProps(id: string, patch: Record<string, unknown>): void;
	addNode(
		parentId: string,
		slotName: string,
		node: KivNode,
		index?: number,
	): void;
	removeNode(id: string): void;
	moveNode(
		id: string,
		targetParentId: string,
		targetSlot: string,
		targetIndex: number,
	): void;
	undo(): void;
	redo(): void;
}

export function useEditorStore(
	initialDocument: KivDocument,
	_registry: Registry,
): EditorStore {
	const past = ref<KivDocument[]>([]);
	const present = ref<KivDocument>(cloneDocument(initialDocument));
	const future = ref<KivDocument[]>([]);
	const selectedId = ref<string | null>(null);
	const breakpoint = ref<Breakpoint>("base");

	function commit(next: KivDocument) {
		past.value = [
			...past.value.slice(-(HISTORY_LIMIT - 1)),
			cloneDocument(present.value),
		];
		future.value = [];
		present.value = next;
	}

	const selected = computed<KivNode | null>(() => {
		if (!selectedId.value) return null;
		function find(node: KivNode): KivNode | null {
			if (node.id === selectedId.value) return node;
			for (const children of Object.values(node.slots ?? {})) {
				for (const child of children) {
					const found = find(child);
					if (found) return found;
				}
			}
			return null;
		}
		return find(present.value.root);
	});

	const canUndo = computed(() => past.value.length > 0);
	const canRedo = computed(() => future.value.length > 0);

	function select(id: string | null) {
		selectedId.value = id;
	}

	function setBreakpoint(bp: Breakpoint) {
		breakpoint.value = bp;
	}

	function updateProps(id: string, patch: Record<string, unknown>) {
		commit(updateNodeProps(present.value, id, patch));
	}

	function add(
		parentId: string,
		slotName: string,
		node: KivNode,
		index?: number,
	) {
		commit(addNode(present.value, parentId, slotName, node, index));
	}

	function remove(id: string) {
		if (selectedId.value === id) selectedId.value = null;
		commit(removeNode(present.value, id));
	}

	function move(
		id: string,
		targetParentId: string,
		targetSlot: string,
		targetIndex: number,
	) {
		commit(
			moveNode(present.value, id, targetParentId, targetSlot, targetIndex),
		);
	}

	function undo() {
		const prev = past.value[past.value.length - 1];
		if (!prev) return;
		future.value = [
			cloneDocument(present.value),
			...future.value.slice(0, HISTORY_LIMIT - 1),
		];
		past.value = past.value.slice(0, -1);
		present.value = prev;
	}

	function redo() {
		const next = future.value[0];
		if (!next) return;
		past.value = [
			...past.value.slice(-(HISTORY_LIMIT - 1)),
			cloneDocument(present.value),
		];
		future.value = future.value.slice(1);
		present.value = next;
	}

	return {
		document: present,
		selected,
		canUndo,
		canRedo,
		breakpoint,
		select,
		setBreakpoint,
		updateProps,
		addNode: add,
		removeNode: remove,
		moveNode: move,
		undo,
		redo,
	};
}
