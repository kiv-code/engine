import type {
	ErrorHandler,
	EventBus,
	EventHandler,
	KivEventMap,
	WildcardHandler,
} from "./types";

interface BusOptions {
	onError?: ErrorHandler;
}

export function createEventBus(opts: BusOptions = {}): EventBus {
	const handlers = new Map<string, Set<EventHandler<unknown>>>();
	const wildcards = new Map<string, Set<WildcardHandler>>();

	function getHandlers(event: string): Set<EventHandler<unknown>> {
		let set = handlers.get(event);
		if (!set) {
			set = new Set();
			handlers.set(event, set);
		}
		return set;
	}

	function getWildcards(pattern: string): Set<WildcardHandler> {
		let set = wildcards.get(pattern);
		if (!set) {
			set = new Set();
			wildcards.set(pattern, set);
		}
		return set;
	}

	function safeCall(fn: () => void, event: string): void {
		try {
			fn();
		} catch (err) {
			if (opts.onError) {
				opts.onError(err, event);
			}
		}
	}

	function emit<K extends keyof KivEventMap>(
		event: K,
		payload: KivEventMap[K],
	): void {
		const eventStr = event as string;

		for (const handler of getHandlers(eventStr)) {
			safeCall(() => handler(payload), eventStr);
		}

		// namespace wildcard: "node.*" matches "node.created", "node.updated"…
		const ns = eventStr.split(".")[0];
		if (ns) {
			const nsPattern = `${ns}.*`;
			for (const handler of getWildcards(nsPattern)) {
				safeCall(() => handler(eventStr, payload), eventStr);
			}
		}

		// global wildcard
		for (const handler of getWildcards("*")) {
			safeCall(() => handler(eventStr, payload), eventStr);
		}
	}

	function on(
		event: string,
		handler: EventHandler<unknown> | WildcardHandler,
	): () => void {
		if (event === "*" || event.endsWith(".*")) {
			const set = getWildcards(event);
			set.add(handler as WildcardHandler);
			return () => set.delete(handler as WildcardHandler);
		}
		const set = getHandlers(event);
		set.add(handler as EventHandler<unknown>);
		return () => set.delete(handler as EventHandler<unknown>);
	}

	function once<K extends keyof KivEventMap>(
		event: K,
		handler: EventHandler<KivEventMap[K]>,
	): () => void {
		const wrapped: EventHandler<unknown> = (payload) => {
			stop();
			(handler as EventHandler<unknown>)(payload);
		};
		const stop = on(event as string, wrapped);
		return stop;
	}

	function off<K extends keyof KivEventMap>(
		event: K,
		handler: EventHandler<KivEventMap[K]>,
	): void {
		handlers.get(event as string)?.delete(handler as EventHandler<unknown>);
	}

	function clear(event?: string): void {
		if (event === undefined) {
			handlers.clear();
			wildcards.clear();
		} else {
			handlers.delete(event);
			wildcards.delete(event);
		}
	}

	return { emit, on: on as EventBus["on"], once, off, clear };
}
