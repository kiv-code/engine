import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ButtonNode from "./ButtonNode.vue";

describe("ButtonNode", () => {
	it("renders an anchor with data-kiv-type and the label", () => {
		const wrapper = mount(ButtonNode, {
			props: { label: "Click me", href: "https://example.com" },
		});
		expect(wrapper.element.tagName).toBe("A");
		expect(wrapper.attributes("data-kiv-type")).toBe("button");
		expect(wrapper.text()).toBe("Click me");
		expect(wrapper.attributes("href")).toBe("https://example.com");
	});

	it("defaults to href='#' and target='_self' when linkType is not external", () => {
		const wrapper = mount(ButtonNode, { props: { label: "Go" } });
		expect(wrapper.attributes("href")).toBe("#");
		expect(wrapper.attributes("target")).toBe("_self");
		expect(wrapper.attributes("rel")).toBeUndefined();
	});

	it("forces target=_blank and rel=noopener for linkType=external", () => {
		const wrapper = mount(ButtonNode, {
			props: { label: "External", href: "https://x.com", linkType: "external" },
		});
		expect(wrapper.attributes("target")).toBe("_blank");
		expect(wrapper.attributes("rel")).toBe("noopener noreferrer");
	});

	it("applies the outline variant colors and full width block display", () => {
		const wrapper = mount(ButtonNode, {
			props: { label: "Outline", variant: "outline", fullWidth: true },
		});
		const style = wrapper.attributes("style") ?? "";
		// The browser coalesces the separately-set `background` and
		// `background-origin` longhands into the `background` shorthand when
		// serializing back to a style string (order: origin, then color).
		expect(style).toContain("background: border-box transparent");
		expect(style).toContain("width: 100%");
		expect(style).toContain("display: block");
	});
});
