import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import EmbedNode from "./EmbedNode.vue";

describe("EmbedNode", () => {
	it("html mode renders a sandboxed srcdoc iframe without allow-same-origin", () => {
		const wrapper = mount(EmbedNode, {
			props: {
				embedType: "html",
				html: "<script>alert(1)</script>",
				sandboxed: true,
			},
		});
		const iframe = wrapper.find("iframe");
		expect(iframe.exists()).toBe(true);
		expect(iframe.attributes("srcdoc")).toBe("<script>alert(1)</script>");
		expect(iframe.attributes("sandbox")).toBe("allow-scripts");
		expect(wrapper.find("script").exists()).toBe(false);
	});

	it("iframe mode renders a sandboxed src iframe", () => {
		const wrapper = mount(EmbedNode, {
			props: {
				embedType: "iframe",
				iframeUrl: "https://example.com",
				sandboxed: true,
			},
		});
		const iframe = wrapper.find("iframe");
		expect(iframe.attributes("src")).toBe("https://example.com");
		expect(iframe.attributes("sandbox")).toContain("allow-same-origin");
	});

	it("omits the sandbox attribute entirely when sandboxed is false", () => {
		const wrapper = mount(EmbedNode, {
			props: {
				embedType: "iframe",
				iframeUrl: "https://example.com",
				sandboxed: false,
			},
		});
		expect(wrapper.find("iframe").attributes("sandbox")).toBeUndefined();
	});
});
