import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import HeadingNode from "./HeadingNode.vue";

describe("HeadingNode", () => {
	it("renders the requested heading tag with the text content", () => {
		const wrapper = mount(HeadingNode, {
			props: { text: "Hello", level: "3" },
		});
		expect(wrapper.element.tagName).toBe("H3");
		expect(wrapper.text()).toBe("Hello");
	});

	it("defaults to h2 and applies size/weight/color from props", () => {
		const wrapper = mount(HeadingNode, {
			props: { text: "Hi", color: "#ff0000", weight: "900" },
		});
		expect(wrapper.element.tagName).toBe("H2");
		expect(wrapper.attributes("style")).toContain("color: #ff0000");
		expect(wrapper.attributes("style")).toContain("font-weight: 900");
	});
});
