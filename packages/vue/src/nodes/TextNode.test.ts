import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TextNode from "./TextNode.vue";

describe("TextNode", () => {
	it("renders a paragraph with data-kiv-type=text and the content", () => {
		const wrapper = mount(TextNode, {
			props: { content: "Hello world" },
		});
		expect(wrapper.element.tagName).toBe("P");
		expect(wrapper.attributes("data-kiv-type")).toBe("text");
		expect(wrapper.text()).toBe("Hello world");
	});

	it("defaults size to 16px, weight to 400, color to inherit and align to left", () => {
		const wrapper = mount(TextNode, {});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("font-size: 16px");
		expect(style).toContain("font-weight: 400");
		expect(style).toContain("color: inherit");
		expect(style).toContain("text-align: left");
		expect(style).toContain("line-height: 1.6");
	});

	it("maps size, weight, color, align, lineHeight and letterSpacing props", () => {
		const wrapper = mount(TextNode, {
			props: {
				content: "Styled",
				size: 24,
				weight: "700",
				color: "#00ff00",
				align: "center",
				lineHeight: "tight",
				letterSpacing: "wide",
			},
		});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("font-size: 24px");
		expect(style).toContain("font-weight: 700");
		expect(style).toContain("color: #00ff00");
		expect(style).toContain("text-align: center");
		expect(style).toContain("line-height: 1.1");
		expect(style).toContain("letter-spacing: 0.025em");
	});
});
