import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import StackNode from "./StackNode.vue";

describe("StackNode", () => {
	it("renders a div with data-kiv-type=stack and slot content", () => {
		const wrapper = mount(StackNode, {
			slots: { default: "<div>item</div>" },
		});
		expect(wrapper.element.tagName).toBe("DIV");
		expect(wrapper.attributes("data-kiv-type")).toBe("stack");
		expect(wrapper.html()).toContain("<div>item</div>");
	});

	it("defaults to a column flex layout with md gap and no wrap", () => {
		const wrapper = mount(StackNode, {});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("display: flex");
		expect(style).toContain("flex-direction: column");
		expect(style).toContain("gap: 16px");
		expect(style).toContain("flex-wrap: nowrap");
		expect(style).toContain("align-items: flex-start");
		expect(style).toContain("justify-content: flex-start");
	});

	it("switches to row direction and wrap when requested", () => {
		const wrapper = mount(StackNode, {
			props: { direction: "row", wrap: true, gap: "xl" },
		});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("flex-direction: row");
		expect(style).toContain("flex-wrap: wrap");
		expect(style).toContain("gap: 48px");
	});

	it("applies background, borderRadius and shadow when not transparent/none", () => {
		const wrapper = mount(StackNode, {
			props: { background: "#eeeeee", borderRadius: "full", shadow: "lg" },
		});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("background: #eeeeee");
		expect(style).toContain("border-radius: 9999px");
		expect(style).toContain("box-shadow: 0 10px 40px");
	});

	it("omits background when it is transparent", () => {
		const wrapper = mount(StackNode, { props: { background: "transparent" } });
		expect(wrapper.attributes("style") ?? "").not.toContain("background:");
	});
});
