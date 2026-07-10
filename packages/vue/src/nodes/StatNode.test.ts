import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import StatNode from "./StatNode.vue";

class FakeIntersectionObserver {
	static instances: FakeIntersectionObserver[] = [];
	callback: (entries: Partial<IntersectionObserverEntry>[]) => void;
	observe = vi.fn();
	disconnect = vi.fn();
	constructor(
		callback: (entries: Partial<IntersectionObserverEntry>[]) => void,
	) {
		this.callback = callback;
		FakeIntersectionObserver.instances.push(this);
	}
}

describe("StatNode", () => {
	afterEach(() => {
		FakeIntersectionObserver.instances = [];
		vi.unstubAllGlobals();
	});

	it("renders the final value immediately when animateOnView is false", async () => {
		const wrapper = mount(StatNode, {
			props: {
				value: 250,
				suffix: "+",
				label: "Customers",
				animateOnView: false,
			},
		});
		await flushPromises();
		expect(wrapper.text()).toContain("250+");
		expect(wrapper.text()).toContain("Customers");
	});

	it("defaults animateOnView to true and observes its root instead of animating immediately", () => {
		vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
		const wrapper = mount(StatNode, { props: { value: 100 } });
		expect(wrapper.text()).not.toContain("100");
		expect(FakeIntersectionObserver.instances[0]?.observe).toHaveBeenCalled();
	});

	it("updates the displayed value when the value prop changes after it already animated", async () => {
		const wrapper = mount(StatNode, {
			props: { value: 100, animateOnView: false },
		});
		await flushPromises();
		expect(wrapper.text()).toContain("100");
		await wrapper.setProps({ value: 2500 });
		expect(wrapper.text()).toContain("2500");
	});

	it("applies prefix/suffix/decimals formatting", async () => {
		const wrapper = mount(StatNode, {
			props: {
				value: 99.5,
				decimals: 1,
				prefix: "$",
				suffix: "k",
				animateOnView: false,
			},
		});
		await flushPromises();
		expect(wrapper.text()).toContain("$99.5k");
	});
});
