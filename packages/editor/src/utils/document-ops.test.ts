import type { KivDocument, KivNode } from "@kiv/engine";
import { describe, expect, it } from "vitest";
import {
	addNode,
	cloneDocument,
	findNode,
	moveNode,
	removeNode,
	updateNodeProps,
} from "./document-ops";

function makeDoc(root: KivNode): KivDocument {
	return {
		schemaVersion: 1,
		root,
		i18n: { default: "en", supported: ["en"] },
	};
}

const baseDoc = makeDoc({
	id: "root",
	type: "page",
	props: {},
	slots: {
		default: [
			{
				id: "section-1",
				type: "section",
				props: { background: "#fff" },
				slots: {
					default: [
						{ id: "heading-1", type: "heading", props: { text: "Hello" } },
					],
				},
			},
		],
	},
});

describe("findNode", () => {
	it("finds root node", () => {
		const loc = findNode(baseDoc, "root");
		expect(loc?.node.id).toBe("root");
		expect(loc?.parent).toBeNull();
	});

	it("finds a nested node", () => {
		const loc = findNode(baseDoc, "heading-1");
		expect(loc?.node.id).toBe("heading-1");
		expect(loc?.parent?.id).toBe("section-1");
		expect(loc?.slotName).toBe("default");
		expect(loc?.index).toBe(0);
	});

	it("returns null for unknown id", () => {
		expect(findNode(baseDoc, "nope")).toBeNull();
	});
});

describe("cloneDocument", () => {
	it("produces a deep copy", () => {
		const clone = cloneDocument(baseDoc);
		expect(clone).toEqual(baseDoc);
		expect(clone).not.toBe(baseDoc);
		expect(clone.root).not.toBe(baseDoc.root);
	});
});

describe("updateNodeProps", () => {
	it("merges patch into node props", () => {
		const next = updateNodeProps(baseDoc, "section-1", {
			background: "#000",
			opacity: 0.5,
		});
		const loc = findNode(next, "section-1");
		expect(loc?.node.props.background).toBe("#000");
		expect(loc?.node.props.opacity).toBe(0.5);
	});

	it("does not mutate original document", () => {
		updateNodeProps(baseDoc, "section-1", { background: "#000" });
		const loc = findNode(baseDoc, "section-1");
		expect(loc?.node.props.background).toBe("#fff");
	});

	it("returns doc unchanged when id not found", () => {
		const next = updateNodeProps(baseDoc, "ghost", { x: 1 });
		expect(next).toEqual(baseDoc);
	});
});

describe("addNode", () => {
	it("appends a node to a slot", () => {
		const newNode: KivNode = {
			id: "text-1",
			type: "text",
			props: { content: "Hi" },
		};
		const next = addNode(baseDoc, "section-1", "default", newNode);
		const slot = next.root.slots?.default?.[0]?.slots?.default;
		expect(slot).toHaveLength(2);
		expect(slot?.[1]?.id).toBe("text-1");
	});

	it("inserts at a specific index", () => {
		const newNode: KivNode = { id: "text-2", type: "text", props: {} };
		const next = addNode(baseDoc, "section-1", "default", newNode, 0);
		const slot = next.root.slots?.default?.[0]?.slots?.default;
		expect(slot?.[0]?.id).toBe("text-2");
		expect(slot?.[1]?.id).toBe("heading-1");
	});
});

describe("removeNode", () => {
	it("removes a node by id", () => {
		const next = removeNode(baseDoc, "heading-1");
		const slot = next.root.slots?.default?.[0]?.slots?.default;
		expect(slot).toHaveLength(0);
	});

	it("does not remove root", () => {
		const next = removeNode(baseDoc, "root");
		expect(next.root.id).toBe("root");
	});

	it("does not mutate original", () => {
		removeNode(baseDoc, "heading-1");
		const slot = baseDoc.root.slots?.default?.[0]?.slots?.default;
		expect(slot).toHaveLength(1);
	});
});

describe("moveNode", () => {
	it("moves a node to a new parent slot", () => {
		const extra = addNode(baseDoc, "root", "default", {
			id: "section-2",
			type: "section",
			props: {},
		});
		const moved = moveNode(extra, "heading-1", "section-2", "default", 0);
		const s1Children = moved.root.slots?.default?.[0]?.slots?.default;
		const s2Children = moved.root.slots?.default?.[1]?.slots?.default;
		expect(s1Children).toHaveLength(0);
		expect(s2Children?.[0]?.id).toBe("heading-1");
	});
});
