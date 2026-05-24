const registry = new WeakMap<object, any>();
const SAFE_PROPS = new Set<string | symbol>([
	"toString",
	"toJSON",
	Symbol.for("nodejs.util.inspect.custom"),
	Symbol.toStringTag,
	Symbol.toPrimitive,
]);

const LOUD_FAILURE_MSG =
	"Redacted instances cannot be enumerated, cloned, or spread. This prevents accidental data loss. Sensitive data must be unwrapped via Redacted.value(instance).";

/**
 * Shared proxy handler to minimize GC overhead.
 */
const REDACTED_HANDLER: ProxyHandler<any> = {
	get(target, prop, receiver) {
		if (SAFE_PROPS.has(prop)) {
			const value = Reflect.get(target, prop, receiver);
			return typeof value === "function" ? value.bind(target) : value;
		}
		throw new Error(
			`Illegal access to Redacted property "${String(prop)}". ${LOUD_FAILURE_MSG}`,
		);
	},

	getOwnPropertyDescriptor(target, prop) {
		// To be spec-compliant, we throw our custom message before the engine
		// can throw a generic TypeError for invariant violations.
		if (Reflect.has(target, prop)) {
			throw new Error(LOUD_FAILURE_MSG);
		}
		return undefined;
	},

	ownKeys() {
		// Throwing here short-circuits enumeration (Object.keys, spread, for-in)
		throw new Error(LOUD_FAILURE_MSG);
	},

	getPrototypeOf() {
		return null;
	},
	setPrototypeOf() {
		throw new Error("Redacted instances are sealed.");
	},

	set() {
		throw new Error("Redacted instances are immutable.");
	},
	defineProperty() {
		throw new Error("Redacted instances are sealed.");
	},
	deleteProperty() {
		throw new Error("Redacted instances are sealed.");
	},
	preventExtensions() {
		return true;
	},
	isExtensible() {
		return false;
	},
};

class RedactedImpl {
	// Marker to satisfy Proxy ownKeys requirements if we ever return keys
	private readonly __redacted_lock__ = true;

	constructor() {
		Object.seal(this);
	}

	toString() {
		return "[Redacted]";
	}
	toJSON() {
		return "[Redacted]";
	}
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return "[Redacted]";
	}
	get [Symbol.toStringTag]() {
		return "Redacted";
	}
}

/**
 * A production-grade container for sensitive values.
 *
 * DESIGN RATIONALE:
 * 1. Proxy-based protection: Any attempt to spread, enumerate, or access properties
 *    directly on a Redacted instance throws a "Loud Failure" error.
 * 2. Identity Resilience: Registers both the target and the proxy in a WeakMap
 *    to prevent identity mismatches during internal unwrapping.
 * 3. Spec-Compliant: Uses property descriptor traps on a sealed target to
 *    enforce the engineering contract without violating Proxy invariants.
 *
 * OPERATIONAL WARNING (Terminal Data Type):
 * This utility is a "terminal data type." It is designed to crash the process
 * if passed to third-party libraries that attempt deep cloning or custom
 * serialization (e.g., Winston, Zod). Use Redacted.sanitize() before logging.
 */
export class Redacted<A> {
	private constructor() {}

	static make<A>(value: A): Redacted<A> {
		const target = new RedactedImpl();
		const proxy = new Proxy(target, REDACTED_HANDLER);

		registry.set(target, value);
		registry.set(proxy, value);

		return proxy as unknown as Redacted<A>;
	}

	static value<A>(self: Redacted<A>): A {
		if (!registry.has(self as any)) {
			throw new Error(
				"Invalid or uninitialized Redacted reference. The instance may have been cloned, spread, or corrupted.",
			);
		}
		return registry.get(self as any);
	}

	/**
	 * Safely sanitizes an object for logging or validation by replacing
	 * Redacted containers with a placeholder string.
	 * Handles circular references to prevent stack overflows.
	 */
	static sanitize(obj: any, seen = new WeakSet<object>()): any {
		if (obj === null || typeof obj !== "object") return obj;
		if (obj instanceof Redacted) return "[Redacted]";

		if (seen.has(obj)) return "[Circular Reference]";
		seen.add(obj);

		if (Array.isArray(obj)) {
			return obj.map((item) => Redacted.sanitize(item, seen));
		}

		const result: Record<string, any> = {};
		for (const key of Object.keys(obj)) {
			result[key] = Redacted.sanitize(obj[key], seen);
		}
		return result;
	}

	/**
	 * Ensures `instanceof Redacted` works for both the proxy and the target.
	 */
	static [Symbol.hasInstance](instance: any) {
		return registry.has(instance);
	}
}
