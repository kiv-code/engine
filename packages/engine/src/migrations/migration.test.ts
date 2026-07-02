import { describe, expect, it } from "vitest";
import type { KivDocument } from "../types";
import {
	CURRENT_SCHEMA_VERSION,
	type Migration,
	migrateDocument,
	migrations,
} from "./migration";

const baseDoc: KivDocument = {
	schemaVersion: 1,
	root: { id: "root", type: "page", props: {} },
	i18n: { default: "en", supported: ["en"] },
};

describe("CURRENT_SCHEMA_VERSION", () => {
	it("is 1", () => {
		expect(CURRENT_SCHEMA_VERSION).toBe(1);
	});
});

describe("migrations registry", () => {
	it("is empty (no migrations needed for v1)", () => {
		expect(migrations).toHaveLength(0);
	});
});

describe("migrateDocument", () => {
	it("returns the same document when already at current version", () => {
		const result = migrateDocument(baseDoc);
		expect(result).toBe(baseDoc);
	});

	it("does not mutate the input document", () => {
		const frozen = Object.freeze({ ...baseDoc });
		expect(() => migrateDocument(frozen as KivDocument)).not.toThrow();
	});

	it("throws when document is newer than engine", () => {
		const futureDoc = { ...baseDoc, schemaVersion: 99 };
		expect(() => migrateDocument(futureDoc)).toThrow(/newer than engine/);
	});

	it("throws when a migration step is missing", () => {
		// A doc at v0 with no 0→1 migration in the registry.
		const oldDoc = { ...baseDoc, schemaVersion: 0 };
		expect(() => migrateDocument(oldDoc)).toThrow(/no migration found/);
	});
});

describe("Migration pipeline logic (isolated)", () => {
	// Test the step-walking logic without touching CURRENT_SCHEMA_VERSION.
	// We build a minimal inline runner that mirrors migrateDocument.
	function runMigrations(
		doc: KivDocument,
		steps: Migration[],
		target: number,
	): KivDocument {
		if (doc.schemaVersion === target) return doc;
		if (doc.schemaVersion > target) throw new Error("newer than engine");
		let current = { ...doc };
		for (let v = current.schemaVersion; v < target; v++) {
			const step = steps.find((m) => m.from === v);
			if (!step) throw new Error(`no migration found for ${v}`);
			current = { ...step.migrate(current), schemaVersion: step.to };
		}
		return current;
	}

	it("applies a single migration step", () => {
		const steps: Migration[] = [
			{ from: 1, to: 2, migrate: (doc) => ({ ...doc, schemaVersion: 2 }) },
		];
		const doc = { ...baseDoc, schemaVersion: 1 };
		const result = runMigrations(doc, steps, 2);
		expect(result.schemaVersion).toBe(2);
	});

	it("applies chained migrations in order", () => {
		const order: number[] = [];
		const steps: Migration[] = [
			{
				from: 1,
				to: 2,
				migrate: (doc) => {
					order.push(1);
					return { ...doc, schemaVersion: 2 };
				},
			},
			{
				from: 2,
				to: 3,
				migrate: (doc) => {
					order.push(2);
					return { ...doc, schemaVersion: 3 };
				},
			},
		];
		const doc = { ...baseDoc, schemaVersion: 1 };
		const result = runMigrations(doc, steps, 3);
		expect(result.schemaVersion).toBe(3);
		expect(order).toEqual([1, 2]);
	});

	it("throws when a gap exists in the chain", () => {
		// Steps jump from 1→2 but skip 2→3.
		const steps: Migration[] = [
			{ from: 1, to: 2, migrate: (doc) => ({ ...doc, schemaVersion: 2 }) },
		];
		const doc = { ...baseDoc, schemaVersion: 1 };
		expect(() => runMigrations(doc, steps, 3)).toThrow(/no migration found/);
	});
});
