import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import KivNodePalette from "./KivNodePalette.vue";

// The palette is <Teleport to="body">, so its content lands outside `wrapper` —
// query `document.body` and mount attached to it, like the app would.
afterEach(() => {
	document.body.innerHTML = "";
});

describe("KivNodePalette", () => {
	it("lists all palette items when the search is empty", () => {
		mount(KivNodePalette, {
			props: { open: true },
			attachTo: document.body,
		});
		expect(document.body.textContent).toContain("Section");
		expect(document.body.textContent).toContain("Heading");
	});

	it("filters the list by search query", async () => {
		mount(KivNodePalette, { props: { open: true }, attachTo: document.body });
		const input = document.body.querySelector("input") as HTMLInputElement;
		input.value = "head";
		input.dispatchEvent(new Event("input"));
		await Promise.resolve();
		expect(document.body.textContent).toContain("Heading");
		expect(document.body.textContent).not.toContain("Section");
	});

	it("emits add with the new node on selection", async () => {
		const wrapper = mount(KivNodePalette, {
			props: { open: true },
			attachTo: document.body,
		});
		const cards = Array.from(
			document.body.querySelectorAll(".kiv-palette-modal__card"),
		);
		const headingCard = cards.find((c) => c.textContent?.includes("Heading"));
		headingCard?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		await Promise.resolve();
		expect(wrapper.emitted("add")).toBeTruthy();
	});
});
