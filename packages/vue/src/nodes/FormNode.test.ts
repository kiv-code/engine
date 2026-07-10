import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { KIV_SERVICES_KEY } from "../services";
import FormNode from "./FormNode.vue";

describe("FormNode", () => {
	it("renders action/method attributes for the native-submit fallback", () => {
		const wrapper = mount(FormNode, {
			props: { submitUrl: "/api/contact", method: "get", submitLabel: "Send" },
		});
		expect(wrapper.attributes("action")).toBe("/api/contact");
		expect(wrapper.attributes("method")).toBe("get");
		expect(wrapper.text()).toContain("Send");
		expect(wrapper.attributes("data-kiv-type")).toBe("form");
	});

	it("submits via services.api when configured and shows the success message", async () => {
		const post = vi.fn().mockResolvedValue({ ok: true });
		const wrapper = mount(FormNode, {
			props: { submitUrl: "/api/contact", successMessage: "Thanks!" },
			global: {
				provide: { [KIV_SERVICES_KEY as unknown as string]: { api: { post } } },
			},
		});
		await wrapper.find("form").trigger("submit");
		await flushPromises();
		expect(post).toHaveBeenCalledWith("/api/contact", expect.any(Object));
		expect(wrapper.text()).toContain("Thanks!");
	});

	it("shows the error message when services.api rejects", async () => {
		const post = vi.fn().mockRejectedValue(new Error("network error"));
		const wrapper = mount(FormNode, {
			props: { submitUrl: "/api/contact", errorMessage: "Oops!" },
			global: {
				provide: { [KIV_SERVICES_KEY as unknown as string]: { api: { post } } },
			},
		});
		await wrapper.find("form").trigger("submit");
		await flushPromises();
		expect(wrapper.text()).toContain("Oops!");
	});
});
