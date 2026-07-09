import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PageNode from "./PageNode.vue";

describe("PageNode", () => {
	it("renders a div with data-kiv-type=page and passes through slot content", () => {
		const wrapper = mount(PageNode, {
			props: { lang: "en" },
			slots: { default: "<main>content</main>" },
		});
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.attributes("data-kiv-type")).toBe("page");
		expect(wrapper.html()).toContain("<main>content</main>");
	});

	it("sets the lang attribute from props", () => {
		const wrapper = mount(PageNode, { props: { lang: "fr" } });
		expect(wrapper.attributes("lang")).toBe("fr");
	});

	it("has no lang attribute when lang is not provided", () => {
		const wrapper = mount(PageNode, {});
		expect(wrapper.attributes("lang")).toBeUndefined();
	});
});
