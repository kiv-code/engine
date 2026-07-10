import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CountdownNode from "./CountdownNode.vue";

describe("CountdownNode", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders the expired message once the target has passed", () => {
		const wrapper = mount(CountdownNode, {
			props: { targetDate: "2000-01-01T00:00:00Z", expiredMessage: "Done!" },
		});
		expect(wrapper.text()).toContain("Done!");
	});

	it("renders day/hour/min/sec units for a future date", () => {
		vi.setSystemTime(new Date("2030-01-01T00:00:00Z"));
		const wrapper = mount(CountdownNode, {
			props: { targetDate: "2030-01-03T01:02:03Z" },
		});
		expect(wrapper.text()).toContain("02"); // days
		expect(wrapper.text()).toContain("Days");
	});

	it("ticks the displayed time forward every second", async () => {
		vi.setSystemTime(new Date("2030-01-01T00:00:00Z"));
		const wrapper = mount(CountdownNode, {
			props: { targetDate: "2030-01-01T00:00:10Z", showLabels: false },
		});
		const before = wrapper.text();
		await vi.advanceTimersByTimeAsync(3000);
		expect(wrapper.text()).not.toBe(before);
	});
});
