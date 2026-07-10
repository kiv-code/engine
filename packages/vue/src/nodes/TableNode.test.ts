import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TableNode from "./TableNode.vue";

describe("TableNode", () => {
	it("renders a real semantic table with headers and rows", () => {
		const wrapper = mount(TableNode, {
			props: {
				data: JSON.stringify({
					headers: ["Name", "Role"],
					rows: [["Ada", "Engineer"]],
				}),
			},
		});
		expect(wrapper.element.tagName).toBe("TABLE");
		expect(wrapper.find("thead").exists()).toBe(true);
		expect(wrapper.findAll("th").map((th) => th.text())).toEqual([
			"Name",
			"Role",
		]);
		expect(wrapper.findAll("td").map((td) => td.text())).toEqual([
			"Ada",
			"Engineer",
		]);
	});

	it("renders an empty table without throwing for malformed JSON", () => {
		expect(() =>
			mount(TableNode, { props: { data: "{not valid" } }),
		).not.toThrow();
		const wrapper = mount(TableNode, { props: { data: "{not valid" } });
		expect(wrapper.find("thead").exists()).toBe(false);
		expect(wrapper.findAll("tr")).toHaveLength(0);
	});

	it("stripes odd rows when striped is enabled", () => {
		const wrapper = mount(TableNode, {
			props: {
				data: JSON.stringify({ headers: ["A"], rows: [["1"], ["2"], ["3"]] }),
				striped: true,
			},
		});
		const rows = wrapper.findAll("tr").slice(1); // skip header row
		expect(
			(rows[1]?.find("td").element as HTMLElement).style.background,
		).toContain("rgba(0, 0, 0, 0.03)");
	});
});
