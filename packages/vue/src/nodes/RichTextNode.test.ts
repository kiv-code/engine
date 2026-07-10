import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import RichTextNode from "./RichTextNode.vue";

describe("RichTextNode", () => {
	it("renders content as HTML via v-html", () => {
		const wrapper = mount(RichTextNode, {
			props: { content: "<b>Bold</b> and <i>italic</i>" },
		});
		expect(wrapper.attributes("data-kiv-type")).toBe("rich-text");
		expect(wrapper.html()).toContain("<b>Bold</b>");
		expect(wrapper.html()).toContain("<i>italic</i>");
	});

	it("defaults size, weight, align and color", () => {
		const wrapper = mount(RichTextNode, {});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("font-size: 16px");
		expect(style).toContain("font-weight: 400");
		expect(style).toContain("text-align: left");
	});

	it("maps lineHeight and letterSpacing scales", () => {
		const wrapper = mount(RichTextNode, {
			props: { lineHeight: "tight", letterSpacing: "wide" },
		});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("line-height: 1.1");
		expect(style).toContain("letter-spacing: 0.025em");
	});

	it("renders an empty string safely when content is undefined", () => {
		const wrapper = mount(RichTextNode, {});
		expect(wrapper.html()).toContain('data-kiv-type="rich-text"');
	});
});
