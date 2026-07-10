import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h } from "vue";
import CardNode from "./CardNode.vue";

describe("CardNode", () => {
	it("renders its default slot content inside a styled wrapper", () => {
		const wrapper = mount(CardNode, {
			slots: { default: () => h("p", "Body") },
		});
		expect(wrapper.attributes("data-kiv-type")).toBe("card");
		expect(wrapper.find("p").text()).toBe("Body");
	});

	it("adds an outline when highlighted", () => {
		const wrapper = mount(CardNode, { props: { highlighted: true } });
		expect((wrapper.element as HTMLElement).style.outline).toContain("6366f1");
	});

	it("applies the hover effect class when set", () => {
		const wrapper = mount(CardNode, { props: { hoverEffect: "lift" } });
		expect(wrapper.classes()).toContain("kiv-hover-lift");
	});
});
