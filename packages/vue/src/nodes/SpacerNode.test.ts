import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { KIV_EDITOR_MODE_KEY } from "../editor-mode";
import SpacerNode from "./SpacerNode.vue";

describe("SpacerNode", () => {
	it("renders a height-only block from the scale", () => {
		const wrapper = mount(SpacerNode, { props: { height: "lg" } });
		expect((wrapper.element as HTMLElement).style.height).toBe("32px");
		expect(wrapper.attributes("data-kiv-type")).toBe("spacer");
	});

	it("shows the guide outline only in editor mode", () => {
		const inEditor = mount(SpacerNode, {
			props: { showDividerOnCanvas: true },
			global: { provide: { [KIV_EDITOR_MODE_KEY as unknown as string]: true } },
		});
		expect(inEditor.classes()).toContain("kiv-spacer--guide");

		const inProduction = mount(SpacerNode, {
			props: { showDividerOnCanvas: true },
		});
		expect(inProduction.classes()).not.toContain("kiv-spacer--guide");
	});
});
