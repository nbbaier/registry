import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["registry/**/*.test.ts"],
	},
	resolve: {
		alias: {
			"@/lib": path.resolve(import.meta.dirname, "registry/default/lib"),
		},
	},
});
