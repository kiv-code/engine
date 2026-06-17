import type { CompiledNode } from "../schema";

export class Registry {
	private nodes = new Map<string, CompiledNode>();

	/** Registra un nodo. Lanza si el tipo ya existe (evita sobrescrituras silenciosas). */
	register(node: CompiledNode): void {
		if (this.nodes.has(node.type)) {
			throw new Error(
				`[kiv] El tipo de nodo "${node.type}" ya está registrado.`,
			);
		}
		this.nodes.set(node.type, node);
	}

	/** Registra varios nodos de una vez (para presets). */
	registerMany(nodes: CompiledNode[]): void {
		for (const node of nodes) {
			this.register(node);
		}
	}

	/** Devuelve la definición de un tipo, o undefined si no existe. */
	get(type: string): CompiledNode | undefined {
		return this.nodes.get(type);
	}

	/** Indica si un tipo está registrado. */
	has(type: string): boolean {
		return this.nodes.has(type);
	}

	/** Lista todos los tipos registrados (útil para el editor). */
	types(): string[] {
		return [...this.nodes.keys()];
	}

	/** Lista todas las definiciones (para construir la paleta del editor). */
	all(): CompiledNode[] {
		return [...this.nodes.values()];
	}
}

/** Crea un registry vacío. */
export function createRegistry(): Registry {
	return new Registry();
}
