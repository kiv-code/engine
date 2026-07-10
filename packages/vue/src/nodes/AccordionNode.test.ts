import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { h } from "vue";
import { KIV_BUS_KEY } from "../bus";
import AccordionItemNode from "./AccordionItemNode.vue";
import AccordionNode from "./AccordionNode.vue";

async function mountAccordion(
	props: Record<string, unknown> = {},
	bus?: unknown,
) {
	const wrapper = mount(AccordionNode, {
		props: { nodeId: "acc-1", ...props },
		slots: {
			default: () => [
				h(AccordionItemNode, { nodeId: "item-1", title: "First" }),
				h(AccordionItemNode, { nodeId: "item-2", title: "Second" }),
				h(AccordionItemNode, { nodeId: "item-3", title: "Third" }),
			],
		},
		global: {
			provide: bus ? { [KIV_BUS_KEY as unknown as string]: bus } : {},
		},
	});
	// Items register with the accordion in their own onMounted, and the
	// accordion then applies defaultOpenIndex in its own onMounted — two
	// cascading reactive updates that each need a microtask to reach the DOM.
	await flushPromises();
	return wrapper;
}

describe("AccordionNode + AccordionItemNode", () => {
	it("renders 3 items, none open by default when defaultOpenIndex is out of range", async () => {
		const wrapper = await mountAccordion({ defaultOpenIndex: -1 });
		const headers = wrapper.findAll('[role="button"]');
		expect(headers).toHaveLength(3);
		for (const header of headers) {
			expect(header.attributes("aria-expanded")).toBe("false");
		}
	});

	it("opens the item at defaultOpenIndex on mount", async () => {
		const wrapper = await mountAccordion({ defaultOpenIndex: 1 });
		const headers = wrapper.findAll('[role="button"]');
		expect(headers[0]?.attributes("aria-expanded")).toBe("false");
		expect(headers[1]?.attributes("aria-expanded")).toBe("true");
		expect(headers[2]?.attributes("aria-expanded")).toBe("false");
	});

	it("clicking a header toggles it open, and closes the previously open one when allowMultiple=false", async () => {
		const wrapper = await mountAccordion({
			defaultOpenIndex: 0,
			allowMultiple: false,
		});
		const headers = wrapper.findAll('[role="button"]');
		await headers[1]?.trigger("click");
		expect(headers[0]?.attributes("aria-expanded")).toBe("false");
		expect(headers[1]?.attributes("aria-expanded")).toBe("true");
	});

	it("allows multiple open items when allowMultiple=true", async () => {
		const wrapper = await mountAccordion({
			defaultOpenIndex: 0,
			allowMultiple: true,
		});
		const headers = wrapper.findAll('[role="button"]');
		await headers[1]?.trigger("click");
		expect(headers[0]?.attributes("aria-expanded")).toBe("true");
		expect(headers[1]?.attributes("aria-expanded")).toBe("true");
	});

	it("keeps at least one item open when keepOneOpen=true", async () => {
		const wrapper = await mountAccordion({
			defaultOpenIndex: 0,
			keepOneOpen: true,
		});
		const headers = wrapper.findAll('[role="button"]');
		await headers[0]?.trigger("click");
		expect(headers[0]?.attributes("aria-expanded")).toBe("true");
	});

	it("closes the open item when keepOneOpen=false", async () => {
		const wrapper = await mountAccordion({
			defaultOpenIndex: 0,
			keepOneOpen: false,
		});
		const headers = wrapper.findAll('[role="button"]');
		await headers[0]?.trigger("click");
		expect(headers[0]?.attributes("aria-expanded")).toBe("false");
	});

	it("emits accordion.itemToggled with the item's index and open state", async () => {
		const emit = vi.fn();
		const wrapper = await mountAccordion({ defaultOpenIndex: -1 }, { emit });
		const headers = wrapper.findAll('[role="button"]');
		await headers[2]?.trigger("click");
		expect(emit).toHaveBeenCalledWith("accordion.itemToggled", {
			nodeId: "acc-1",
			itemIndex: 2,
			isOpen: true,
		});
	});

	it("does not toggle a disabled item", async () => {
		const wrapper = mount(AccordionNode, {
			props: { nodeId: "acc-1" },
			slots: {
				default: () => [
					h(AccordionItemNode, {
						nodeId: "item-1",
						title: "First",
						disabled: true,
					}),
				],
			},
		});
		const header = wrapper.find('[role="button"]');
		await header.trigger("click");
		expect(header.attributes("aria-expanded")).toBe("false");
	});
});
