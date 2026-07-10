import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";
import { KIV_BUS_KEY } from "../bus";
import TabPanelNode from "./TabPanelNode.vue";
import TabsNode from "./TabsNode.vue";

afterEach(() => {
	document.body.innerHTML = "";
});

async function mountTabs(props: Record<string, unknown> = {}, bus?: unknown) {
	const wrapper = mount(TabsNode, {
		props: { nodeId: "tabs-1", ...props },
		slots: {
			default: () => [
				h(
					TabPanelNode,
					{ nodeId: "panel-1", title: "One" },
					() => "Content one",
				),
				h(
					TabPanelNode,
					{ nodeId: "panel-2", title: "Two" },
					() => "Content two",
				),
				h(
					TabPanelNode,
					{ nodeId: "panel-3", title: "Three", disabled: true },
					() => "Content three",
				),
			],
		},
		// isVisible() (used to assert v-show state below) needs a real,
		// attached document to compute styles correctly under happy-dom.
		attachTo: document.body,
		global: {
			provide: bus ? { [KIV_BUS_KEY as unknown as string]: bus } : {},
		},
	});
	// Panels register with Tabs in their own onMounted, and Tabs then picks
	// the default active panel in its own onMounted — two cascading reactive
	// updates that each need a microtask to reach the DOM.
	await flushPromises();
	return wrapper;
}

describe("TabsNode + TabPanelNode", () => {
	it("renders one tab button per panel, using each panel's title", async () => {
		const wrapper = await mountTabs();
		const tabs = wrapper.findAll('[role="tab"]');
		expect(tabs.map((t) => t.text().trim())).toEqual(["One", "Two", "Three"]);
	});

	it("activates the panel at defaultTab and shows only that panel", async () => {
		const wrapper = await mountTabs({ defaultTab: 1 });
		const panels = wrapper.findAll('[data-kiv-type="tab-panel"]');
		expect(panels[0]?.isVisible()).toBe(false);
		expect(panels[1]?.isVisible()).toBe(true);
	});

	it("switches the active panel when a tab is clicked", async () => {
		const wrapper = await mountTabs({ defaultTab: 0 });
		const tabs = wrapper.findAll('[role="tab"]');
		await tabs[1]?.trigger("click");
		const panels = wrapper.findAll('[data-kiv-type="tab-panel"]');
		expect(panels[0]?.isVisible()).toBe(false);
		expect(panels[1]?.isVisible()).toBe(true);
	});

	it("does not activate a disabled panel", async () => {
		const wrapper = await mountTabs({ defaultTab: 0 });
		const tabs = wrapper.findAll('[role="tab"]');
		await tabs[2]?.trigger("click");
		const panels = wrapper.findAll('[data-kiv-type="tab-panel"]');
		expect(panels[0]?.isVisible()).toBe(true);
		expect(panels[2]?.isVisible()).toBe(false);
	});

	it("emits tabs.tabChanged with the new index and title", async () => {
		const emit = vi.fn();
		const wrapper = await mountTabs({ defaultTab: 0 }, { emit });
		const tabs = wrapper.findAll('[role="tab"]');
		await tabs[1]?.trigger("click");
		expect(emit).toHaveBeenCalledWith("tabs.tabChanged", {
			nodeId: "tabs-1",
			currentIndex: 1,
			currentTitle: "Two",
		});
	});
});
