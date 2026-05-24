import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = resolve(root, "public/r");
const artifact = resolve(artifactDir, "option.json");

if (!existsSync(artifact)) {
	console.error("Missing built artifact. Run `bun run registry:build` first.");
	process.exit(1);
}

const serverRoot = resolve(root, "public");
const server = createServer((req, res) => {
	const url = new URL(req.url ?? "/", "http://localhost");
	const filePath = resolve(serverRoot, `.${url.pathname}`);
	if (!filePath.startsWith(serverRoot) || !existsSync(filePath)) {
		res.writeHead(404);
		res.end("Not found");
		return;
	}
	readFile(filePath).then((body) => {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(body);
	});
});

await new Promise<void>((resolvePromise, reject) => {
	server.listen(0, "127.0.0.1", () => resolvePromise());
	server.on("error", reject);
});

const address = server.address();
if (!address || typeof address === "string") {
	throw new Error("Failed to start smoke test server");
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const dir = await mkdtemp(join(tmpdir(), "registry-smoke-"));

try {
	await writeFile(
		join(dir, "package.json"),
		JSON.stringify(
			{ name: "registry-smoke", private: true, type: "module" },
			null,
			2,
		),
	);

	await writeFile(
		join(dir, "components.json"),
		JSON.stringify(
			{
				$schema: "https://ui.shadcn.com/schema.json",
				style: "new-york",
				rsc: false,
				tsx: true,
				tailwind: {
					config: "tailwind.config.ts",
					css: "src/styles/globals.css",
					baseColor: "neutral",
					cssVariables: true,
				},
				aliases: {
					utils: "@/lib/utils",
					components: "@/components",
					ui: "@/components/ui",
					lib: "@/lib",
					hooks: "@/hooks",
				},
			},
			null,
			2,
		),
	);

	await writeFile(
		join(dir, "tsconfig.json"),
		JSON.stringify(
			{
				compilerOptions: {
					target: "ES2022",
					module: "ESNext",
					moduleResolution: "bundler",
					strict: true,
					baseUrl: ".",
					paths: {
						"@/*": ["./src/*"],
					},
				},
				include: ["src/**/*.ts"],
			},
			null,
			2,
		),
	);

	await mkdir(join(dir, "src/lib"), { recursive: true });
	await mkdir(join(dir, "src/styles"), { recursive: true });
	await writeFile(
		join(dir, "tailwind.config.ts"),
		"export default { content: [] };\n",
	);
	await writeFile(join(dir, "src/styles/globals.css"), "/* smoke test */\n");

	await new Promise<void>((resolvePromise, reject) => {
		const child = spawn(
			"bunx",
			[
				"shadcn@2.10.0",
				"add",
				`${baseUrl}/r/option.json`,
				"--yes",
				"--overwrite",
			],
			{ cwd: dir, stdio: "inherit" },
		);
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) resolvePromise();
			else reject(new Error(`shadcn add exited with code ${code}`));
		});
	});

	const installed = join(dir, "src/lib/option.ts");
	if (!existsSync(installed)) {
		throw new Error("Smoke test failed: lib/option.ts was not installed");
	}

	const content = await readFile(installed, "utf8");
	if (!content.includes("Option")) {
		throw new Error("Smoke test failed: installed option.ts looks invalid");
	}

	console.log("Smoke test passed: shadcn add installed option.ts");
} finally {
	server.close();
	await rm(dir, { recursive: true, force: true });
}
