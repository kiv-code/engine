import { describe, expect, it } from "vitest";
import { createRegistry } from "../registry";
import { defineNode, f } from "../schema";
import type { KivDocument, KivNode } from "../types";
import { renderToHtml } from "./render-to-html";

function makeDoc(root: KivNode, i18n: KivDocument["i18n"]): KivDocument {
	return { schemaVersion: 1, root, i18n };
}

describe("renderToHtml", () => {
	it("falls back to a generic div for a node type with no toHtml", () => {
		const registry = createRegistry();
		registry.register(defineNode({ type: "mystery", fields: {} }));
		const doc = makeDoc(
			{ id: "n1", type: "mystery", props: {} },
			{ default: "en", supported: ["en"] },
		);
		const html = renderToHtml(doc, { registry });
		expect(html).toBe(
			'<div data-kiv-type="mystery" data-kiv-node-id="n1"></div>',
		);
	});

	it("uses the node's toHtml implementation when available", () => {
		const registry = createRegistry();
		registry.register(
			defineNode({
				type: "heading",
				fields: { text: f.text() },
				toHtml(props, children, ctx) {
					return `<h1 data-locale="${ctx.locale}">${props.text}${children.default ?? ""}</h1>`;
				},
			}),
		);
		const doc = makeDoc(
			{ id: "h1", type: "heading", props: { text: "Hello" } },
			{ default: "en", supported: ["en"] },
		);
		const html = renderToHtml(doc, { registry });
		expect(html).toBe('<h1 data-locale="en">Hello</h1>');
	});

	it("recursively renders children into their slot before calling the parent's toHtml", () => {
		const registry = createRegistry();
		registry.register(
			defineNode({
				type: "section",
				fields: {},
				toHtml(_props, children) {
					return `<section>${children.default ?? ""}</section>`;
				},
			}),
		);
		registry.register(
			defineNode({
				type: "text",
				fields: { content: f.text() },
				toHtml(props) {
					return `<p>${props.content}</p>`;
				},
			}),
		);
		const doc = makeDoc(
			{
				id: "s1",
				type: "section",
				props: {},
				slots: {
					default: [
						{ id: "t1", type: "text", props: { content: "First" } },
						{ id: "t2", type: "text", props: { content: "Second" } },
					],
				},
			},
			{ default: "en", supported: ["en"] },
		);
		const html = renderToHtml(doc, { registry });
		expect(html).toBe("<section><p>First</p><p>Second</p></section>");
	});

	it("resolves responsive props for the requested breakpoint", () => {
		const registry = createRegistry();
		registry.register(
			defineNode({
				type: "box",
				fields: {},
				toHtml(props) {
					return `<div style="width:${props.width}px"></div>`;
				},
			}),
		);
		const doc = makeDoc(
			{ id: "b1", type: "box", props: { width: { base: 100, lg: 400 } } },
			{ default: "en", supported: ["en"] },
		);
		expect(renderToHtml(doc, { registry })).toBe(
			'<div style="width:100px"></div>',
		);
		expect(renderToHtml(doc, { registry, breakpoint: "lg" })).toBe(
			'<div style="width:400px"></div>',
		);
	});

	it("resolves localized props for the requested locale, defaulting to document.i18n.default", () => {
		const registry = createRegistry();
		registry.register(
			defineNode({
				type: "text",
				fields: {},
				toHtml(props) {
					return `<p>${props.content}</p>`;
				},
			}),
		);
		const doc = makeDoc(
			{
				id: "t1",
				type: "text",
				props: { content: { $t: { en: "Hello", es: "Hola" } } },
			},
			{ default: "es", supported: ["en", "es"] },
		);
		expect(renderToHtml(doc, { registry })).toBe("<p>Hola</p>");
		expect(renderToHtml(doc, { registry, locale: "en" })).toBe("<p>Hello</p>");
	});

	it("escapes node id and type in the fallback wrapper", () => {
		const registry = createRegistry();
		const doc = makeDoc(
			{ id: '"><script>', type: "unknown", props: {} },
			{ default: "en", supported: ["en"] },
		);
		const html = renderToHtml(doc, { registry });
		expect(html).not.toContain("<script>");
		expect(html).toContain("&lt;script&gt;");
	});
});
