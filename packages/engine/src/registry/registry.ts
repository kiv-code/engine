import type { CompiledNode } from "../schema";

export class Registry {
	private nodes = new Map<string, CompiledNode>();

	/** Registers a node. Throws if the type already exists (avoids silent overwrites). */
	register(node: CompiledNode): void {
		if (this.nodes.has(node.type)) {
			throw new Error(
				`[kiv] The node type "${node.type}" is already registered.`,
			);
		}
		this.nodes.set(node.type, node);
	}

	/** Registers several nodes at once (for presets). */
	registerMany(nodes: CompiledNode[]): void {
		for (const node of nodes) {
			this.register(node);
		}
	}

	/** Returns the definition of a type, or undefined if it doesn't exist. */
	get(type: string): CompiledNode | undefined {
		return this.nodes.get(type);
	}

	/** Indicates whether a type is registered. */
	has(type: string): boolean {
		return this.nodes.has(type);
	}

	/** Lists all registered types (useful for the editor). */
	types(): string[] {
		return [...this.nodes.keys()];
	}

	/** Lists all definitions (to build the editor's palette). */
	all(): CompiledNode[] {
		return [...this.nodes.values()];
	}
}

/** Creates an empty registry. */
export function createRegistry(): Registry {
	return new Registry();
}
