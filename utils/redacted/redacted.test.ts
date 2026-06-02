// Adapted from https://gist.github.com/daliborgogic/0cddc4eb6f365e932932b8ef44d4d49b

import { describe, expect, it } from "vitest";
import { Redacted } from "./redacted";

describe("Redacted Production-Grade Safety", () => {
	it("unwraps a value correctly", () => {
		const secret = { key: "shhh" };
		const r = Redacted.make(secret);
		expect(Redacted.value(r)).toBe(secret);
	});

	it("prevents exposure via common methods", () => {
		const r = Redacted.make("secret");
		expect(r.toString()).toBe("[Redacted]");
		expect(JSON.stringify(r)).toBe('"[Redacted]"');
	});

	describe("Loud Failure (The Engineering Contract)", () => {
		it("throws EXPLICITLY when spreading the object", () => {
			const r = Redacted.make("secret");

			// Attempting to spread should throw because ownKeys() or getOwnPropertyDescriptor() throws
			expect(() => ({ ...r })).toThrow(
				/Redacted instances cannot be enumerated/,
			);
		});

		it("throws EXPLICITLY when using Object.assign", () => {
			const r = Redacted.make("secret");
			expect(() => Object.assign({}, r)).toThrow(
				/Redacted instances cannot be enumerated/,
			);
		});

		it("fails during structuredClone (Platform-level failure)", () => {
			const r = Redacted.make({ data: 123 });

			// structuredClone throws DataCloneError for Proxies
			expect(() => structuredClone(r)).toThrow();
		});

		it("prevents illegal property access", () => {
			const r = Redacted.make("secret");
			// @ts-expect-error - testing runtime safety
			expect(() => r.someRandomKey).toThrow(
				/Illegal access to Redacted property/,
			);
		});
	});

	describe("Performance & GC Safety", () => {
		it("maintains performance under load", () => {
			const count = 10_000;
			const start = performance.now();

			const items: Redacted<number>[] = [];
			for (let i = 0; i < count; i++) {
				items.push(Redacted.make(i));
			}

			const end = performance.now();
			expect(items.length).toBe(count);
			expect(end - start).toBeLessThan(500); // Should be very fast
		});

		it("passes instanceof checks", () => {
			const r = Redacted.make("secret");
			expect(r instanceof Redacted).toBe(true);
		});
	});

	describe("Redacted.sanitize()", () => {
		it("replaces redacted instances in nested objects", () => {
			const secret = Redacted.make("shhh");
			const payload = {
				user: "dalibor",
				token: secret,
				meta: {
					key: secret,
				},
				list: [secret, "normal"],
			};

			const sanitized = Redacted.sanitize(payload);

			expect(sanitized.user).toBe("dalibor");
			expect(sanitized.token).toBe("[Redacted]");
			expect(sanitized.meta.key).toBe("[Redacted]");
			expect(sanitized.list[0]).toBe("[Redacted]");
			expect(sanitized.list[1]).toBe("normal");

			// Original should be untouched (since we returned a new object)
			expect(Redacted.value(payload.token)).toBe("shhh");
		});

		it("handles primitive values correctly", () => {
			expect(Redacted.sanitize(42)).toBe(42);
			expect(Redacted.sanitize("string")).toBe("string");
			expect(Redacted.sanitize(null)).toBe(null);
		});
	});
});
