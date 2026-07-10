import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import FormFieldNode from "./FormFieldNode.vue";

describe("FormFieldNode", () => {
	it("renders a labeled text input by default", () => {
		const wrapper = mount(FormFieldNode, {
			props: {
				fieldType: "text",
				name: "email",
				label: "Email",
				required: true,
			},
		});
		expect(wrapper.find("label").text()).toBe("Email");
		const input = wrapper.find("input");
		expect(input.attributes("type")).toBe("text");
		expect(input.attributes("name")).toBe("email");
		expect(input.attributes("required")).toBeDefined();
	});

	it("renders a select with options from the comma-separated field", () => {
		const wrapper = mount(FormFieldNode, {
			props: {
				fieldType: "select",
				name: "plan",
				options: "Basic, Pro, Enterprise",
			},
		});
		const options = wrapper.findAll("option");
		expect(options.map((o) => o.text())).toEqual([
			"Basic",
			"Pro",
			"Enterprise",
		]);
	});

	it("renders a textarea for the textarea field type", () => {
		const wrapper = mount(FormFieldNode, {
			props: { fieldType: "textarea", name: "message" },
		});
		expect(wrapper.find("textarea").exists()).toBe(true);
	});

	it("renders a checkbox for the checkbox field type", () => {
		const wrapper = mount(FormFieldNode, {
			props: { fieldType: "checkbox", name: "agree" },
		});
		expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
	});
});
