import { describe, expect, it } from "vitest";
import { version } from "./index";

describe("@kiv/engine", () => {
	it("expone una versión", () => {
		expect(version).toBe("0.0.0");
	});
});
