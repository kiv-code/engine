import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TestimonialNode from "./TestimonialNode.vue";

describe("TestimonialNode", () => {
	it("renders the quote and author details", () => {
		const wrapper = mount(TestimonialNode, {
			props: {
				quote: "Great product",
				authorName: "Jane Doe",
				authorRole: "CEO",
			},
		});
		expect(wrapper.attributes("data-kiv-type")).toBe("testimonial");
		expect(wrapper.text()).toContain("Great product");
		expect(wrapper.text()).toContain("Jane Doe");
		expect(wrapper.text()).toContain("CEO");
	});

	it("renders star rating svgs when rating > 0", () => {
		const wrapper = mount(TestimonialNode, {
			props: { quote: "Hi", rating: 3 },
		});
		expect(wrapper.find(".kiv-testimonial__stars svg").exists()).toBe(true);
	});

	it("omits the stars block when rating is 0", () => {
		const wrapper = mount(TestimonialNode, {
			props: { quote: "Hi", rating: 0 },
		});
		expect(wrapper.find(".kiv-testimonial__stars").exists()).toBe(false);
	});

	it("switches to a centered column layout for the centered variant", () => {
		const wrapper = mount(TestimonialNode, {
			props: { quote: "Hi", layout: "centered" },
		});
		expect((wrapper.element as HTMLElement).style.flexDirection).toBe("column");
	});
});
