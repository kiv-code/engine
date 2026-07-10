import { describe, expect, it, vi } from "vitest";
import type { KivDocument, KivNode } from "../types";
import { EditorEngine } from "./editor-engine";

function makeDoc(): KivDocument {
	return {
		schemaVersion: 1,
		root: {
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
		},
		i18n: { default: "en", supported: ["en"] },
	};
}

describe("EditorEngine", () => {
	it("initializes with a clone of the given document", () => {
		const doc = makeDoc();
		const engine = new EditorEngine(doc);
		expect(engine.document.root.id).toBe("root");
		expect(engine.document).not.toBe(doc);
	});

	it("addNode appends a child and emits node.created", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("node.created", handler);
		const node: KivNode = { id: "text-1", type: "text", props: {} };
		engine.addNode({ parentId: "section-1", slot: "default", node });
		const children = engine.document.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(2);
		expect(handler).toHaveBeenCalledWith({
			id: "text-1",
			parentId: "section-1",
			slot: "default",
		});
	});

	it("removeNode removes a child and emits node.removed", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("node.removed", handler);
		engine.removeNode("heading-1");
		const children = engine.document.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(0);
		expect(handler).toHaveBeenCalledWith({ id: "heading-1" });
	});

	it("removeNode clears the selection if the removed node was selected", () => {
		const engine = new EditorEngine(makeDoc());
		engine.selection.select("heading-1");
		engine.removeNode("heading-1");
		expect(engine.selection.has("heading-1")).toBe(false);
	});

	it("updateNodeProps patches props and emits node.propsChanged", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("node.propsChanged", handler);
		engine.updateNodeProps("section-1", { background: "#000" });
		const section = engine.document.root.slots?.default?.[0];
		expect(section?.props.background).toBe("#000");
		expect(handler).toHaveBeenCalledWith({
			id: "section-1",
			patch: { background: "#000" },
		});
	});

	it("moveNode relocates a node and emits node.moved", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("node.moved", handler);
		engine.moveNode({
			id: "heading-1",
			targetParentId: "root",
			targetSlot: "default",
			targetIndex: 1,
		});
		expect(engine.document.root.slots?.default).toHaveLength(2);
		expect(engine.document.root.slots?.default?.[1]?.id).toBe("heading-1");
		expect(handler).toHaveBeenCalledOnce();
	});

	it("renameNode renames and keeps the node selected under its new id", () => {
		const engine = new EditorEngine(makeDoc());
		engine.selection.select("heading-1");
		const ok = engine.renameNode("heading-1", "title-1");
		expect(ok).toBe(true);
		expect(engine.selection.has("title-1")).toBe(true);
		expect(engine.findNode("title-1")).not.toBeNull();
	});

	it("renameNode rejects empty, unchanged, or colliding ids", () => {
		const engine = new EditorEngine(makeDoc());
		expect(engine.renameNode("heading-1", "  ")).toBe(false);
		expect(engine.renameNode("heading-1", "heading-1")).toBe(false);
		expect(engine.renameNode("heading-1", "section-1")).toBe(false);
	});

	it("duplicateNode inserts a copy right after the original", () => {
		const engine = new EditorEngine(makeDoc());
		engine.duplicateNode("heading-1");
		const children = engine.document.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(2);
	});

	it("undo/redo cycle restores document state and emits history.changed", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("history.changed", handler);
		expect(engine.canUndo).toBe(false);
		engine.updateNodeProps("section-1", { background: "#000" });
		expect(engine.canUndo).toBe(true);
		engine.undo();
		expect(engine.document.root.slots?.default?.[0]?.props.background).toBe(
			"#fff",
		);
		expect(engine.canRedo).toBe(true);
		engine.redo();
		expect(engine.document.root.slots?.default?.[0]?.props.background).toBe(
			"#000",
		);
		expect(handler).toHaveBeenCalled();
	});

	it("undo does nothing when history is empty", () => {
		const engine = new EditorEngine(makeDoc());
		engine.undo();
		expect(engine.document.root.id).toBe("root");
	});

	it("canUseId reports collisions and allows a node's own current id", () => {
		const engine = new EditorEngine(makeDoc());
		expect(engine.canUseId("section-1")).toBe(false);
		expect(engine.canUseId("section-1", "section-1")).toBe(true);
		expect(engine.canUseId("brand-new")).toBe(true);
	});

	it("setNodeFlags updates locked/visible and emits node.flagsChanged", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("node.flagsChanged", handler);
		engine.setNodeFlags("heading-1", { locked: true, visible: false });
		const loc = engine.findNode("heading-1");
		expect(loc?.node.locked).toBe(true);
		expect(loc?.node.visible).toBe(false);
		expect(handler).toHaveBeenCalledWith({ id: "heading-1" });
	});

	it("batches rapid edits into a single undo step", () => {
		const engine = new EditorEngine(makeDoc());
		expect(engine.canUndo).toBe(false);
		engine.startBatch();
		engine.updateNodeProps("section-1", { background: "#111" });
		engine.updateNodeProps("section-1", { background: "#222" });
		engine.updateNodeProps("section-1", { background: "#333" });
		expect(engine.document.root.slots?.default?.[0]?.props.background).toBe(
			"#333",
		);
		// Live document updates immediately even though the batch is still open.
		expect(engine.canUndo).toBe(false);
		engine.endBatch();
		expect(engine.canUndo).toBe(true);
		engine.undo();
		expect(engine.document.root.slots?.default?.[0]?.props.background).toBe(
			"#fff",
		);
		expect(engine.canRedo).toBe(true);
	});

	it("supports nested startBatch/endBatch — only the outermost pair commits", () => {
		const engine = new EditorEngine(makeDoc());
		engine.startBatch();
		engine.startBatch();
		engine.updateNodeProps("section-1", { background: "#111" });
		engine.endBatch();
		expect(engine.canUndo).toBe(false);
		engine.updateNodeProps("section-1", { background: "#222" });
		engine.endBatch();
		expect(engine.canUndo).toBe(true);
		engine.undo();
		expect(engine.document.root.slots?.default?.[0]?.props.background).toBe(
			"#fff",
		);
	});

	it("does not record an undo step for an empty batch", () => {
		const engine = new EditorEngine(makeDoc());
		engine.startBatch();
		engine.endBatch();
		expect(engine.canUndo).toBe(false);
	});

	it("isBatching reflects whether a batch is currently open", () => {
		const engine = new EditorEngine(makeDoc());
		expect(engine.isBatching).toBe(false);
		engine.startBatch();
		expect(engine.isBatching).toBe(true);
		engine.endBatch();
		expect(engine.isBatching).toBe(false);
	});

	it("updateNodeProps is a no-op when the target node is locked", () => {
		const engine = new EditorEngine(makeDoc());
		engine.setNodeFlags("section-1", { locked: true });
		engine.updateNodeProps("section-1", { background: "#000" });
		const section = engine.document.root.slots?.default?.[0];
		expect(section?.props.background).toBe("#fff");
	});

	it("removeNode is a no-op when the target node is locked", () => {
		const engine = new EditorEngine(makeDoc());
		engine.setNodeFlags("heading-1", { locked: true });
		engine.removeNode("heading-1");
		const children = engine.document.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(1);
	});

	it("moveNode is a no-op when the moved node is locked", () => {
		const engine = new EditorEngine(makeDoc());
		engine.setNodeFlags("heading-1", { locked: true });
		engine.moveNode({
			id: "heading-1",
			targetParentId: "root",
			targetSlot: "default",
			targetIndex: 1,
		});
		expect(engine.document.root.slots?.default).toHaveLength(1);
	});

	it("selection changes emit selection.changed on the bus", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("selection.changed", handler);
		engine.selection.select("heading-1");
		expect(handler).toHaveBeenCalledWith({ ids: ["heading-1"] });
	});

	it("updateSeoMeta merges into document.seo and emits document.seoChanged", () => {
		const engine = new EditorEngine(makeDoc());
		const handler = vi.fn();
		engine.bus.on("document.seoChanged", handler);
		engine.updateSeoMeta({ title: "Home" });
		engine.updateSeoMeta({ description: "Welcome" });
		expect(engine.document.seo).toEqual({
			title: "Home",
			description: "Welcome",
		});
		expect(handler).toHaveBeenCalledTimes(2);
	});

	it("loadDocument replaces the whole document as a single undo step and clears selection", () => {
		const engine = new EditorEngine(makeDoc());
		engine.selection.select("heading-1");
		const template: KivDocument = {
			schemaVersion: 1,
			root: { id: "root", type: "page", props: {} },
			i18n: { default: "en", supported: ["en"] },
		};
		const handler = vi.fn();
		engine.bus.on("document.loaded", handler);
		engine.loadDocument(template);
		expect(engine.document.root.slots).toBeUndefined();
		expect(engine.selection.ids).toHaveLength(0);
		expect(handler).toHaveBeenCalledTimes(1);
		expect(engine.canUndo).toBe(true);
		engine.undo();
		expect(engine.document.root.id).toBe("root");
		expect(engine.document.root.slots?.default).toHaveLength(1);
	});

	it("loadDocument clones its input so later mutations to the source object don't leak in", () => {
		const engine = new EditorEngine(makeDoc());
		const template: KivDocument = {
			schemaVersion: 1,
			root: { id: "root", type: "page", props: {} },
			i18n: { default: "en", supported: ["en"] },
		};
		engine.loadDocument(template);
		template.root.props.mutated = true;
		expect(engine.document.root.props.mutated).toBeUndefined();
	});
});
