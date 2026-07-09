import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import GridNode from "./GridNode.vue";

describe("GridNode", () => {
	it("renders a div with data-kiv-type=grid and slot content", () => {
		const wrapper = mount(GridNode, {
			slots: { default: "<div>cell</div>" },
		});
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.attributes("data-kiv-type")).toBe("grid");
		expect(wrapper.html()).toContain("<div>cell</div>");
	});

	it("defaults to a single column with md gaps and stretch alignment", () => {
		const wrapper = mount(GridNode, {});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("display: grid");
		expect(style).toContain("grid-template-columns: repeat(1, minmax(0, 1fr))");
		expect(style).toContain("column-gap: 16px");
		expect(style).toContain("row-gap: 16px");
		expect(style).toContain("align-items: stretch");
	});

	it("maps columns, gap, rowGap and alignItems props", () => {
		const wrapper = mount(GridNode, {
			props: { columns: "4", gap: "xl", rowGap: "none", alignItems: "center" },
		});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("grid-template-columns: repeat(4, minmax(0, 1fr))");
		expect(style).toContain("column-gap: 48px");
		expect(style).toContain("row-gap: 0");
		expect(style).toContain("align-items: center");
	});
});
