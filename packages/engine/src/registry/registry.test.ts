import { describe, expect, it } from "vitest";
import { defineNode, f } from "../schema";
import { createRegistry } from "./index";

const heading = defineNode({
	type: "heading",
	fields: { text: f.text() },
});

describe("Registry", () => {
	it("registers and retrieves a node", () => {
		const reg = createRegistry();
		reg.register(heading);
		expect(reg.get("heading")).toBe(heading);
		expect(reg.has("heading")).toBe(true);
	});

	it("returns undefined for unregistered types", () => {
		const reg = createRegistry();
		expect(reg.get("nonexistent")).toBeUndefined();
		expect(reg.has("nonexistent")).toBe(false);
	});

	it("throws when registering a duplicate type", () => {
		const reg = createRegistry();
		reg.register(heading);
		expect(() => reg.register(heading)).toThrow(/is already registered/);
	});

	it("lists registered types", () => {
		const reg = createRegistry();
		reg.registerMany([heading]);
		expect(reg.types()).toEqual(["heading"]);
		expect(reg.all()).toHaveLength(1);
	});
});
