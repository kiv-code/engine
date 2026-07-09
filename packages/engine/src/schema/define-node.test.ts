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
	it("compila un schema que valida props correctas", () => {
		const result = heading.schema.safeParse({ text: "Hola", level: "2" });
		expect(result.success).toBe(true);
	});

	it("rechaza props inválidas", () => {
		const result = heading.schema.safeParse({ level: "99" });
		expect(result.success).toBe(false);
	});

	it("deriva defaults de los fields", () => {
		expect(heading.defaults).toEqual({ level: 2 });
	});

	it("infiere el tipo de props", () => {
		// Comprobación en tiempo de compilación: si esto compila, el tipo es correcto.
		const props: InferProps<typeof heading> = { text: "Hola", level: 3 };
		expect(props.text).toBe("Hola");
	});

	it("pasa label, icon, description y slotConstraints al nodo compilado", () => {
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
