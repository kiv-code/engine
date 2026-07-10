import {
	ButtonNode,
	ColumnNode,
	ContainerNode,
	DividerNode,
	GridNode,
	HeadingNode,
	IconNode,
	ImageNode,
	LinkNode,
	PageNode,
	RichTextNode,
	SectionNode,
	StackNode,
	TextNode,
	VideoNode,
} from "./nodes";
import { createVueRegistry } from "./registry";

/**
 * Creates a VueRegistry pre-loaded with components for all 10 base nodes.
 * Pass additional calls to .register() to extend it with custom nodes.
 */
export function createDefaultVueRegistry() {
	const registry = createVueRegistry();
	registry.register("page", PageNode);
	registry.register("section", SectionNode);
	registry.register("container", ContainerNode);
	registry.register("stack", StackNode);
	registry.register("grid", GridNode);
	registry.register("column", ColumnNode);
	registry.register("heading", HeadingNode);
	registry.register("rich-text", RichTextNode);
	registry.register("text", TextNode);
	registry.register("button", ButtonNode);
	registry.register("link", LinkNode);
	registry.register("image", ImageNode);
	registry.register("video", VideoNode);
	registry.register("icon", IconNode);
	registry.register("divider", DividerNode);
	return registry;
}
