import { createRegistry } from "@kiv/engine";
import { describe, expect, it } from "vitest";
import {
	ALL_NODES,
	buttonNode,
	columnNode,
	containerNode,
	DEFAULT_COLOR_OR_GRADIENT,
	gridNode,
	headingNode,
	imageNode,
	pageNode,
	sectionNode,
	stackNode,
	textNode,
} from "./index";

describe("ALL_NODES", () => {
	it("contains 15 nodes", () => {
		expect(ALL_NODES).toHaveLength(15);
	});

	it("all nodes have unique types", () => {
		const types = ALL_NODES.map((n) => n.type);
		expect(new Set(types).size).toBe(15);
	});

	it("registers without errors into a Registry", () => {
		const registry = createRegistry();
		expect(() => registry.registerMany([...ALL_NODES])).not.toThrow();
	});

	it("all nodes have a category", () => {
		for (const node of ALL_NODES) {
			expect(node.category).toBeDefined();
		}
	});

	it("every node's defaults satisfy its own compiled schema", () => {
		for (const node of ALL_NODES) {
			const result = node.schema.safeParse(node.defaults);
			expect(
				result.success,
				`${node.type}: ${JSON.stringify(result.error?.issues)}`,
			).toBe(true);
		}
	});
});

describe("layout nodes", () => {
	it("page: type and default lang", () => {
		expect(pageNode.type).toBe("page");
		expect(pageNode.defaults.lang).toBe("en");
	});

	it("section: type and key defaults", () => {
		expect(sectionNode.type).toBe("section");
		expect(sectionNode.defaults.fullWidth).toBe(true);
		expect(sectionNode.defaults.overlay).toBe(false);
		expect(sectionNode.defaults.opacity).toBe(1);
	});

	it("container: type and default maxWidth", () => {
		expect(containerNode.type).toBe("container");
		expect(containerNode.defaults.maxWidth).toBe("lg");
		expect(containerNode.defaults.centered).toBe(true);
	});

	it("stack: type and default direction", () => {
		expect(stackNode.type).toBe("stack");
		expect(stackNode.defaults.direction).toBe("column");
		expect(stackNode.defaults.wrap).toBe(false);
	});

	it("grid: type and default columns", () => {
		expect(gridNode.type).toBe("grid");
		expect(gridNode.defaults.columns).toBe("12");
	});

	it("column: type and default span", () => {
		expect(columnNode.type).toBe("column");
		expect(columnNode.defaults.span).toBe("auto");
		expect(columnNode.defaults.offset).toBe("0");
	});
});

describe("content nodes", () => {
	it("heading: type and default level", () => {
		expect(headingNode.type).toBe("heading");
		expect(headingNode.defaults.level).toBe("2");
		expect(headingNode.defaults.align).toBe("left");
	});

	it("text: type and default size", () => {
		expect(textNode.type).toBe("text");
		expect(textNode.defaults.size).toBe(16);
	});

	it("button: type and navigation defaults", () => {
		expect(buttonNode.type).toBe("button");
		expect(buttonNode.defaults.href).toBe("#");
		expect(buttonNode.defaults.target).toBe("_self");
		expect(buttonNode.defaults.linkType).toBe("internal");
		expect(buttonNode.defaults.variant).toBe("primary");
	});
});

describe("media nodes", () => {
	it("image: type and default fit", () => {
		expect(imageNode.type).toBe("image");
		expect(imageNode.defaults.fit).toBe("cover");
		expect(imageNode.defaults.aspectRatio).toBe("auto");
	});
});

describe("node schemas", () => {
	it("section schema accepts valid props", () => {
		const result = sectionNode.schema.safeParse({
			background: { ...DEFAULT_COLOR_OR_GRADIENT, solid: "#fff" },
			paddingY: "lg",
			overlay: true,
			overlayColor: { ...DEFAULT_COLOR_OR_GRADIENT, solid: "#000", alpha: 0.5 },
		});
		expect(result.success).toBe(true);
	});

	it("button schema accepts valid props", () => {
		const result = buttonNode.schema.safeParse({
			label: "Get started",
			href: "/pricing",
			linkType: "internal",
			variant: "primary",
		});
		expect(result.success).toBe(true);
	});

	it("heading schema accepts a plain string for text", () => {
		const result = headingNode.schema.safeParse({
			text: "Hello world",
			level: "1",
		});
		expect(result.success).toBe(true);
	});
});

describe("toHtml", () => {
	const ctx = { locale: "en", breakpoint: "base" as const };

	it("every node renders non-empty HTML from its own defaults", () => {
		for (const node of ALL_NODES) {
			const html = node.toHtml?.(node.defaults, {}, ctx);
			expect(html, `${node.type} has no toHtml`).toBeDefined();
			expect(html?.trim().length ?? 0, node.type).toBeGreaterThan(0);
			expect(html, node.type).toContain(`data-kiv-type="${node.type}"`);
		}
	});

	it("heading renders the requested tag and escapes text", () => {
		const html = headingNode.toHtml?.(
			{ text: "<script>alert(1)</script>", level: "3" },
			{},
			ctx,
		);
		expect(html).toContain("<h3");
		expect(html).not.toContain("<script>");
		expect(html).toContain("&lt;script&gt;");
	});

	it("container centers by default and stops centering when centered is false", () => {
		const centered = containerNode.toHtml?.({}, {}, ctx);
		expect(centered).toContain("margin-left: auto");

		const uncentered = containerNode.toHtml?.({ centered: false }, {}, ctx);
		expect(uncentered).not.toContain("margin-left");
	});

	it("section renders the overlay div only when enabled", () => {
		const withOverlay = sectionNode.toHtml?.(
			{ overlay: true, overlayColor: "rgba(1,2,3,0.5)" },
			{},
			ctx,
		);
		expect(withOverlay).toContain("kiv-section__overlay");

		const withoutOverlay = sectionNode.toHtml?.({}, {}, ctx);
		expect(withoutOverlay).not.toContain("kiv-section__overlay");
	});

	it("button renders an anchor with the variant background", () => {
		const html = buttonNode.toHtml?.(
			{ label: "Go", href: "/pricing", variant: "secondary" },
			{},
			ctx,
		);
		expect(html).toContain('<a href="/pricing"');
		expect(html).toContain("Go");
		expect(html).toContain("--kiv-color-secondary");
	});

	it("container nests its children inside the wrapper div", () => {
		const html = containerNode.toHtml?.({}, { default: "<p>Hi</p>" }, ctx);
		expect(html).toContain("<p>Hi</p>");
	});
});
