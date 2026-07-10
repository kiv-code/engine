import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import LinkNode from "./LinkNode.vue";

describe("LinkNode", () => {
	it("falls back to the flat text prop when no slot content is provided", () => {
		const wrapper = mount(LinkNode, {
			props: { text: "Hello", href: "https://example.com" },
		});
		expect(wrapper.element.tagName).toBe("A");
		expect(wrapper.attributes("data-kiv-type")).toBe("link");
		expect(wrapper.text()).toBe("Hello");
		expect(wrapper.attributes("href")).toBe("https://example.com");
	});

	it("defaults to 'Link' when neither slot nor text prop is set", () => {
		const wrapper = mount(LinkNode, {});
		expect(wrapper.text()).toBe("Link");
	});

	it("renders default slot content instead of the flat text prop when provided", () => {
		const wrapper = mount(LinkNode, {
			props: { text: "Ignored fallback", href: "#" },
			slots: { default: "<strong>Slotted</strong>" },
		});
		expect(wrapper.html()).toContain("<strong>Slotted</strong>");
		expect(wrapper.text()).not.toContain("Ignored fallback");
	});

	it("sets target=_blank and rel=noopener for external links", () => {
		const wrapper = mount(LinkNode, {
			props: { text: "Go", href: "https://x.com", target: "_blank" },
		});
		expect(wrapper.attributes("target")).toBe("_blank");
		expect(wrapper.attributes("rel")).toBe("noopener noreferrer");
	});

	it("applies button-variant styling when display=button", () => {
		const wrapper = mount(LinkNode, {
			props: { text: "Click", display: "button", variant: "primary" },
		});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("display: inline-block");
	});
});
