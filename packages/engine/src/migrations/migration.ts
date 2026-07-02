import type { KivDocument } from "../types";

export const CURRENT_SCHEMA_VERSION = 1;

export interface Migration {
	from: number;
	to: number;
	migrate(doc: KivDocument): KivDocument;
}

export const migrations: Migration[] = [
	// No migrations yet — only schemaVersion 1 exists.
	// Add entries here as new versions are introduced:
	// { from: 1, to: 2, migrate(doc) { return { ...doc, schemaVersion: 2, ... } } },
];

export function migrateDocument(doc: KivDocument): KivDocument {
	if (doc.schemaVersion === CURRENT_SCHEMA_VERSION) {
		return doc;
	}

	if (doc.schemaVersion > CURRENT_SCHEMA_VERSION) {
		throw new Error(
			`migrate: document schemaVersion ${doc.schemaVersion} is newer than engine version ${CURRENT_SCHEMA_VERSION}`,
		);
	}

	let current = { ...doc };

	for (let v = current.schemaVersion; v < CURRENT_SCHEMA_VERSION; v++) {
		const step = migrations.find((m) => m.from === v);
		if (!step) {
			throw new Error(
				`migrate: no migration found for schemaVersion ${v} → ${v + 1}`,
			);
		}
		current = { ...step.migrate(current), schemaVersion: step.to };
	}

	return current;
}
