import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ImageNode from "./ImageNode.vue";

describe("ImageNode", () => {
	it("renders an img with data-kiv-type=image, src and alt", () => {
		const wrapper = mount(ImageNode, {
			props: { src: "https://example.com/pic.jpg", alt: "A picture" },
		});
		expect(wrapper.element.tagName).toBe("IMG");
		expect(wrapper.attributes("data-kiv-type")).toBe("image");
		expect(wrapper.attributes("src")).toBe("https://example.com/pic.jpg");
		expect(wrapper.attributes("alt")).toBe("A picture");
	});

	it("defaults alt to an empty string and fit to cover at 100% width", () => {
		const wrapper = mount(ImageNode, {});
		expect(wrapper.attributes("alt")).toBe("");
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("object-fit: cover");
		expect(style).toContain("width: 100%");
	});

	it("omits aspect-ratio when set to auto but includes it otherwise", () => {
		const auto = mount(ImageNode, { props: { aspectRatio: "auto" } });
		expect(auto.attributes("style") ?? "").not.toContain("aspect-ratio");

		const fixed = mount(ImageNode, { props: { aspectRatio: "16/9" } });
		expect((fixed.element as HTMLElement).style.aspectRatio).toBe("16 / 9");
	});

	it("maps borderRadius and shadow scales", () => {
		const wrapper = mount(ImageNode, {
			props: { borderRadius: "lg", shadow: "md" },
		});
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("border-radius: 16px");
		expect(style).toContain("box-shadow: 0 4px 16px");
	});
});
