import { describe, expect, it, vi } from "vitest";
import type { KivPlugin } from "../plugin";
import { defineNode } from "../schema";
import { createEngine } from "./create-engine";

describe("createEngine", () => {
	it("creates engine with defaults", () => {
		const engine = createEngine();
		expect(engine.i18n.default).toBe("en");
		expect(engine.i18n.supported).toEqual(["en"]);
		expect(engine.theme.colors.primary).toBeDefined();
	});

	it("merges theme override", () => {
		const engine = createEngine({
			theme: { colors: { primary: "#ff0000" } },
		});
		expect(engine.theme.colors.primary).toBe("#ff0000");
		expect(engine.theme.colors.background).toBeDefined();
	});

	it("accepts custom i18n config", () => {
		const engine = createEngine({
			i18n: { default: "es", supported: ["es", "en"] },
		});
		expect(engine.i18n.default).toBe("es");
		expect(engine.i18n.supported).toContain("en");
	});

	it("registers initial nodes", () => {
		const node = defineNode({
			type: "test-node",
			category: "content",
			fields: {},
		});
		const engine = createEngine({ nodes: [node] });
		expect(engine.registry.has("test-node")).toBe(true);
	});

	it("installs plugins provided at creation", () => {
		const installed = vi.fn();
		const plugin: KivPlugin = { name: "test", install: installed };
		createEngine({ plugins: [plugin] });
		expect(installed).toHaveBeenCalledOnce();
	});

	it("engine.use() installs a plugin", () => {
		const engine = createEngine();
		const installed = vi.fn();
		const plugin: KivPlugin = { name: "my-plugin", install: installed };
		engine.use(plugin);
		expect(installed).toHaveBeenCalledOnce();
	});

	it("engine.use() passes correct context to plugin", () => {
		const engine = createEngine();
		let receivedCtx: Parameters<KivPlugin["install"]>[0] | undefined;
		const plugin: KivPlugin = {
			name: "ctx-check",
			install(ctx) {
				receivedCtx = ctx;
			},
		};
		engine.use(plugin);
		expect(receivedCtx?.bus).toBe(engine.bus);
		expect(receivedCtx?.registry).toBe(engine.registry);
		expect(receivedCtx?.theme).toBe(engine.theme);
	});

	it("engine.use() throws on duplicate plugin name", () => {
		const engine = createEngine();
		const plugin: KivPlugin = { name: "dupe", install: vi.fn() };
		engine.use(plugin);
		expect(() => engine.use(plugin)).toThrow(
			'El plugin "dupe" ya está instalado',
		);
	});

	it("engine.css() produces :root block with CSS variables", () => {
		const engine = createEngine();
		const css = engine.css();
		expect(css).toContain(":root {");
		expect(css).toContain("--kiv-color-primary");
		expect(css).toContain("--kiv-spacing-md");
	});

	it("engine.resolve() resolves node props", () => {
		const engine = createEngine();
		const node = {
			id: "n1",
			type: "heading",
			props: { text: "Hello" },
		};
		const result = engine.resolve(node, { locale: "en", breakpoint: "base" });
		expect(result.props.text).toBe("Hello");
	});

	it("plugin can register a node via context", () => {
		const engine = createEngine();
		const customNode = defineNode({
			type: "custom-block",
			category: "content",
			fields: {},
		});
		const plugin: KivPlugin = {
			name: "node-adder",
			install(ctx) {
				ctx.registry.register(customNode);
			},
		};
		engine.use(plugin);
		expect(engine.registry.has("custom-block")).toBe(true);
	});

	it("plugin can emit and listen on the bus via context", () => {
		const engine = createEngine();
		const received: unknown[] = [];
		engine.bus.on("node.selected" as never, (p: unknown) => {
			received.push(p);
		});
		const plugin: KivPlugin = {
			name: "emitter",
			install(ctx) {
				ctx.bus.emit("node.selected" as never, { id: "n1" } as never);
			},
		};
		engine.use(plugin);
		expect(received).toHaveLength(1);
	});
});
