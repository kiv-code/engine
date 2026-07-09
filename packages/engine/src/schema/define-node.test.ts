import { describe, expect, it } from "vitest";
import { defineNode, f, type InferProps } from "./index";

const heading = defineNode({
	type: "heading",
	fields: {
		text: f.text({ localizable: true }),
		level: f.select([1, 2, 3, 4], { default: 2 }),
	},
});

describe("defineNode", () => {
	it("compiles a schema that validates correct props", () => {
		const result = heading.schema.safeParse({ text: "Hola", level: "2" });
		expect(result.success).toBe(true);
	});

	it("rejects invalid props", () => {
		const result = heading.schema.safeParse({ level: "99" });
		expect(result.success).toBe(false);
	});

	it("derives defaults from the fields", () => {
		expect(heading.defaults).toEqual({ level: 2 });
	});

	it("infers the props type", () => {
		// Compile-time check: if this compiles, the type is correct.
		const props: InferProps<typeof heading> = { text: "Hola", level: 3 };
		expect(props.text).toBe("Hola");
	});

	it("passes label, icon, description and slotConstraints to the compiled node", () => {
		const column = defineNode({
			type: "column",
			category: "layout",
			label: "Column",
			icon: "columns",
			description: "A single column inside a grid.",
			slotConstraints: { default: ["heading", "text"] },
			fields: {},
		});
		expect(column.label).toBe("Column");
		expect(column.icon).toBe("columns");
		expect(column.description).toBe("A single column inside a grid.");
		expect(column.slotConstraints).toEqual({ default: ["heading", "text"] });
	});

	it("preserves placeholder, hint, required and hidden on field descriptors", () => {
		const button = defineNode({
			type: "button",
			fields: {
				label: f.text({
					placeholder: "Click me",
					hint: "Shown on the button face",
					required: true,
				}),
				id: f.text({ hidden: true }),
			},
		});
		expect(button.fields.label).toMatchObject({
			placeholder: "Click me",
			hint: "Shown on the button face",
			required: true,
		});
		expect(button.fields.id).toMatchObject({ hidden: true });
	});
});
