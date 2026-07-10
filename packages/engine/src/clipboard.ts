import type { KivNode } from "./types";

/** Serializes a node (and its subtree) to JSON for clipboard storage. */
export function serializeNode(node: KivNode): string {
	return JSON.stringify(node);
}

/** Deserializes a node from clipboard JSON. Returns null on invalid JSON or a shape missing `id`/`type`. */
export function deserializeNode(json: string): KivNode | null {
	try {
		const node = JSON.parse(json) as KivNode;
		if (!node || typeof node !== "object" || Array.isArray(node)) return null;
		if (!node.id || !node.type) return null;
		return node;
	} catch {
		return null;
	}
}

function reIdNode(node: KivNode, suffix: string): KivNode {
	const newSlots: Record<string, KivNode[]> = {};
	for (const [slot, children] of Object.entries(node.slots ?? {})) {
		newSlots[slot] = children.map((c) => reIdNode(c, suffix));
	}
	return {
		...node,
		id: `${node.id}-${suffix}`,
		slots: Object.keys(newSlots).length > 0 ? newSlots : undefined,
	};
}

/** Deep-clones a node tree, appending a suffix to every id to avoid collisions with the original. */
export function cloneNodeTree(node: KivNode, suffix?: string): KivNode {
	const s = suffix ?? Math.random().toString(36).slice(2, 8);
	return reIdNode(node, s);
}
