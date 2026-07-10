import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import SocialIconsNode from "./SocialIconsNode.vue";

describe("SocialIconsNode", () => {
	it("renders a link per known platform", () => {
		const wrapper = mount(SocialIconsNode, {
			props: {
				links: JSON.stringify([
					{ platform: "twitter", url: "https://x.com/kiv" },
					{ platform: "github", url: "https://github.com/kiv" },
				]),
			},
		});
		const links = wrapper.findAll("a");
		expect(links).toHaveLength(2);
		expect(links[0]?.attributes("href")).toBe("https://x.com/kiv");
		expect(links[1]?.attributes("href")).toBe("https://github.com/kiv");
	});

	it("renders an empty container without throwing for invalid JSON", () => {
		expect(() =>
			mount(SocialIconsNode, { props: { links: "not json" } }),
		).not.toThrow();
		const wrapper = mount(SocialIconsNode, { props: { links: "not json" } });
		expect(wrapper.attributes("data-kiv-type")).toBe("social-icons");
		expect(wrapper.findAll("a")).toHaveLength(0);
	});

	it("applies the hover effect class to each link", () => {
		const wrapper = mount(SocialIconsNode, {
			props: {
				links: JSON.stringify([
					{ platform: "email", url: "mailto:hi@kiv.dev" },
				]),
				hoverEffect: "grow",
			},
		});
		expect(wrapper.find("a").classes()).toContain("kiv-hover-grow");
	});
});
