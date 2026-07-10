import { describe, expect, it } from "vitest";
import {
	createPaletteNode,
	LEAF_TYPES,
	paletteItemByType,
} from "./palette-items";

describe("palette-items — link container support", () => {
	it("link has hasDefaultSlot=true so new links can nest icon/image/text children", () => {
		expect(paletteItemByType("link")?.hasDefaultSlot).toBe(true);
	});

	it("link is not in LEAF_TYPES", () => {
		expect(LEAF_TYPES.has("link")).toBe(false);
	});

	it("createPaletteNode('link') gets an empty default slot, not undefined", () => {
		const node = createPaletteNode("link");
		expect(node.slots).toEqual({ default: [] });
	});

	it("leaf types still get no slots object", () => {
		const node = createPaletteNode("button");
		expect(node.slots).toBeUndefined();
	});
});
