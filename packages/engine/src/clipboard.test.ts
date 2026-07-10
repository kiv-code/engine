import { describe, expect, it } from "vitest";
import { cloneNodeTree, deserializeNode, serializeNode } from "./clipboard";
import type { KivNode } from "./types";

function makeNode(): KivNode {
	return {
		id: "section-1",
		type: "section",
		props: { background: "#fff" },
		slots: {
			default: [
				{ id: "heading-1", type: "heading", props: { text: "Hi" } },
				{
					id: "grid-1",
					type: "grid",
					props: {},
					slots: {
						default: [{ id: "column-1", type: "column", props: {} }],
					},
				},
			],
		},
	};
}

describe("serializeNode / deserializeNode", () => {
	it("round-trips a node through JSON", () => {
		const node = makeNode();
		const json = serializeNode(node);
		const back = deserializeNode(json);
		expect(back).toEqual(node);
	});

	it("returns null for invalid JSON", () => {
		expect(deserializeNode("{not json")).toBeNull();
	});

	it("returns null when the parsed value is not an object", () => {
		expect(deserializeNode("42")).toBeNull();
		expect(deserializeNode("[]")).toBeNull();
		expect(deserializeNode('"a string"')).toBeNull();
	});

	it("returns null when id or type is missing", () => {
		expect(
			deserializeNode(JSON.stringify({ type: "heading", props: {} })),
		).toBeNull();
		expect(deserializeNode(JSON.stringify({ id: "x", props: {} }))).toBeNull();
	});
});

describe("cloneNodeTree", () => {
	it("appends a suffix to the root id and every descendant id", () => {
		const node = makeNode();
		const clone = cloneNodeTree(node, "abcd");
		expect(clone.id).toBe("section-1-abcd");
		expect(clone.slots?.default?.[0]?.id).toBe("heading-1-abcd");
		const nestedGrid = clone.slots?.default?.[1];
		expect(nestedGrid?.id).toBe("grid-1-abcd");
		expect(nestedGrid?.slots?.default?.[0]?.id).toBe("column-1-abcd");
	});

	it("does not mutate the original node", () => {
		const node = makeNode();
		cloneNodeTree(node, "abcd");
		expect(node.id).toBe("section-1");
		expect(node.slots?.default?.[0]?.id).toBe("heading-1");
	});

	it("generates a random suffix when none is given, producing distinct ids across calls", () => {
		const node = makeNode();
		const a = cloneNodeTree(node);
		const b = cloneNodeTree(node);
		expect(a.id).not.toBe(b.id);
		expect(a.id.startsWith("section-1-")).toBe(true);
	});

	it("preserves props and leaves slots undefined for leaf nodes", () => {
		const leaf: KivNode = {
			id: "text-1",
			type: "text",
			props: { content: "hi" },
		};
		const clone = cloneNodeTree(leaf, "xy");
		expect(clone.props).toEqual({ content: "hi" });
		expect(clone.slots).toBeUndefined();
	});
});
