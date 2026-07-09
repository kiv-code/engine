import type { KivDocument } from "@kiv/engine";
import { createRegistry } from "@kiv/engine";
import { ALL_NODES } from "@kiv/nodes";
import { createDefaultVueRegistry } from "@kiv/vue";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { EDITOR_STORE_KEY } from "../store/context";
import { useEditorStore } from "../store/editor-store";
import KivCanvas from "./KivCanvas.vue";

const engineRegistry = createRegistry();
engineRegistry.registerMany([...ALL_NODES]);

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
						props: {},
						slots: {
							default: [
								{
									id: "heading-1",
									type: "heading",
									props: { text: "Hello", level: 1 },
								},
							],
						},
					},
				],
			},
		},
		i18n: { default: "en", supported: ["en"] },
	};
}

function mountCanvas(doc = makeDoc()) {
	const store = useEditorStore(doc, engineRegistry);
	const wrapper = mount(KivCanvas, {
		props: { registry: createDefaultVueRegistry() },
		global: { provide: { [EDITOR_STORE_KEY]: store } },
		attachTo: document.body,
	});
	return { store, wrapper };
}

afterEach(() => {
	document.body.innerHTML = "";
});

describe("KivCanvas", () => {
	it("selects a node when its rendered element is clicked", () => {
		const { store, wrapper } = mountCanvas();
		const heading = wrapper.find('[data-kiv-node-id="heading-1"]');
		expect(heading.exists()).toBe(true);
		heading.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(store.selected.value?.id).toBe("heading-1");
	});

	it("clears the selection when clicking empty canvas background", () => {
		const { store, wrapper } = mountCanvas();
		store.select("heading-1");
		expect(store.selected.value?.id).toBe("heading-1");

		const canvas = wrapper.find(".kiv-canvas");
		canvas.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(store.selected.value).toBeNull();
	});

	it("removes the selected node on Delete", () => {
		const { store } = mountCanvas();
		store.select("heading-1");

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));

		const children =
			store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(0);
		expect(store.selected.value).toBeNull();
	});

	it("removes the selected node on Backspace", () => {
		const { store } = mountCanvas();
		store.select("heading-1");

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));

		const children =
			store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(0);
	});

	it("clears the selection on Escape", () => {
		const { store } = mountCanvas();
		store.select("heading-1");
		expect(store.selected.value?.id).toBe("heading-1");

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

		expect(store.selected.value).toBeNull();
	});

	it("undoes the last mutation on Cmd/Ctrl+Z", () => {
		const { store } = mountCanvas();
		store.select("heading-1");
		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
		let children =
			store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(0);

		window.dispatchEvent(
			new KeyboardEvent("keydown", { key: "z", ctrlKey: true }),
		);

		children = store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(1);
		expect(children?.[0]?.id).toBe("heading-1");
	});

	it("does not select a locked node when its rendered element is clicked", () => {
		const { store, wrapper } = mountCanvas();
		store.setLocked("heading-1", true);
		const heading = wrapper.find('[data-kiv-node-id="heading-1"]');
		heading.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(store.selected.value).toBeNull();
	});

	it("does not delete a locked node even when it was already selected", () => {
		const { store } = mountCanvas();
		store.select("heading-1");
		store.setLocked("heading-1", true);

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));

		const children =
			store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(1);
	});

	it("ignores keyboard shortcuts while focus is on an input", () => {
		const { store } = mountCanvas();
		store.select("heading-1");

		const input = document.createElement("input");
		document.body.appendChild(input);
		input.focus();
		expect(document.activeElement).toBe(input);

		window.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));

		const children =
			store.document.value.root.slots?.default?.[0]?.slots?.default;
		expect(children).toHaveLength(1);

		input.remove();
	});
});
