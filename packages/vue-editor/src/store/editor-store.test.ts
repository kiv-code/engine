import type { KivDocument, KivNode } from "@kiv/engine";
import { createEventBus, createRegistry } from "@kiv/engine";
import { describe, expect, it, vi } from "vitest";
import { useEditorStore } from "./editor-store";

const registry = createRegistry();

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

describe("useEditorStore", () => {
	it("initializes with the given document", () => {
		const doc = makeDoc();
		const store = useEditorStore(doc, registry);
		expect(store.document.value.root.id).toBe("root");
	});

	it("select sets the selected node", () => {
		const store = useEditorStore(makeDoc(), registry);
		expect(store.selected.value).toBeNull();
		store.select("heading-1");
		expect(store.selected.value?.id).toBe("heading-1");
	});

	it("select(null) clears selection", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.select("heading-1");
		store.select(null);
		expect(store.selected.value).toBeNull();
	});

	it("updateProps patches node props", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.updateProps("section-1", { background: "#000" });
		const section = store.document.value.root.slots?.default?.[0];
		expect(section?.props.background).toBe("#000");
	});

	it("addNode appends a child", () => {
		const store = useEditorStore(makeDoc(), registry);
		const newNode: KivNode = { id: "text-1", type: "text", props: {} };
		store.addNode("section-1", "default", newNode);
		const children =
			store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(2);
	});

	it("removeNode removes a child", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.removeNode("heading-1");
		const children =
			store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(0);
	});

	it("removeNode clears selection if selected node is removed", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.select("heading-1");
		store.removeNode("heading-1");
		expect(store.selected.value).toBeNull();
	});

	it("undo/redo cycle restores document state", () => {
		const store = useEditorStore(makeDoc(), registry);
		expect(store.canUndo.value).toBe(false);
		store.updateProps("section-1", { background: "#000" });
		expect(store.canUndo.value).toBe(true);
		store.undo();
		const section = store.document.value.root.slots?.default?.[0];
		expect(section?.props.background).toBe("#fff");
		expect(store.canRedo.value).toBe(true);
		store.redo();
		const sectionAfterRedo = store.document.value.root.slots?.default?.[0];
		expect(sectionAfterRedo?.props.background).toBe("#000");
	});

	it("new action clears redo stack", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.updateProps("section-1", { background: "#111" });
		store.undo();
		expect(store.canRedo.value).toBe(true);
		store.updateProps("section-1", { background: "#222" });
		expect(store.canRedo.value).toBe(false);
	});

	it("undo does nothing when history is empty", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.undo();
		expect(store.document.value.root.id).toBe("root");
	});

	it("setLocked toggles a node's locked flag", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.setLocked("heading-1", true);
		const heading =
			store.document.value.root.slots?.default?.[0]?.slots?.default?.[0];
		expect(heading?.locked).toBe(true);
		store.setLocked("heading-1", false);
		const updated =
			store.document.value.root.slots?.default?.[0]?.slots?.default?.[0];
		expect(updated?.locked).toBe(false);
	});

	it("setVisible sets a node's visible flag", () => {
		const store = useEditorStore(makeDoc(), registry);
		store.setVisible("heading-1", false);
		const heading =
			store.document.value.root.slots?.default?.[0]?.slots?.default?.[0];
		expect(heading?.visible).toBe(false);
	});

	it("forwards editor mutations onto a shared bus when provided", () => {
		const bus = createEventBus();
		const handler = vi.fn();
		bus.on("node.propsChanged", handler);
		const store = useEditorStore(makeDoc(), registry, { bus });
		store.updateProps("heading-1", { text: "Hi" });
		expect(handler).toHaveBeenCalledWith({
			id: "heading-1",
			patch: { text: "Hi" },
		});
	});
});
