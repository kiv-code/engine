import { describe, expect, it } from "vitest";
import { defineNode, f } from "../schema";
import { createRegistry } from "./index";

const heading = defineNode({
	type: "heading",
	fields: { text: f.text() },
});

describe("Registry", () => {
	it("registra y recupera un nodo", () => {
		const reg = createRegistry();
		reg.register(heading);
		expect(reg.get("heading")).toBe(heading);
		expect(reg.has("heading")).toBe(true);
	});

	it("devuelve undefined para tipos no registrados", () => {
		const reg = createRegistry();
		expect(reg.get("inexistente")).toBeUndefined();
		expect(reg.has("inexistente")).toBe(false);
	});

	it("lanza al registrar un tipo duplicado", () => {
		const reg = createRegistry();
		reg.register(heading);
		expect(() => reg.register(heading)).toThrow(/ya está registrado/);
	});

	it("lista los tipos registrados", () => {
		const reg = createRegistry();
		reg.registerMany([heading]);
		expect(reg.types()).toEqual(["heading"]);
		expect(reg.all()).toHaveLength(1);
	});
});
