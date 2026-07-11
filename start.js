import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const rootDir = resolve("dist");
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const indexFile = join(rootDir, "index.html");

const mimeTypes = new Map([
	[".html", "text/html; charset=utf-8"],
	[".js", "application/javascript; charset=utf-8"],
	[".mjs", "application/javascript; charset=utf-8"],
	[".css", "text/css; charset=utf-8"],
	[".json", "application/json; charset=utf-8"],
	[".map", "application/json; charset=utf-8"],
	[".svg", "image/svg+xml"],
	[".png", "image/png"],
	[".jpg", "image/jpeg"],
	[".jpeg", "image/jpeg"],
	[".webp", "image/webp"],
	[".ico", "image/x-icon"],
	[".woff", "font/woff"],
	[".woff2", "font/woff2"],
	[".ttf", "font/ttf"],
	[".txt", "text/plain; charset=utf-8"],
]);

function securityHeaders(contentType) {
	return {
		"Content-Type": contentType,
		"Cross-Origin-Opener-Policy": "same-origin",
		"Cross-Origin-Embedder-Policy": "require-corp",
		"Cross-Origin-Resource-Policy": "same-origin",
		"X-Content-Type-Options": "nosniff",
	};
}

function resolvePath(urlPath) {
	const decodedPath = decodeURIComponent(urlPath);
	const safePath = normalize(decodedPath)
		.replace(/^(\.\.(\/|\\|$))+/, "")
		.replace(/^\/+/, "");
	return join(rootDir, safePath);
}

async function serveFile(res, filePath) {
	const fileExt = extname(filePath).toLowerCase();
	const contentType = mimeTypes.get(fileExt) || "application/octet-stream";
	const body = await readFile(filePath);

	res.writeHead(200, securityHeaders(contentType));
	res.end(body);
}

async function handleRequest(req, res) {
	try {
		if (!["GET", "HEAD"].includes(req.method || "GET")) {
			res.writeHead(405, {
				Allow: "GET, HEAD",
				"Content-Type": "text/plain; charset=utf-8",
			});
			res.end("Method Not Allowed");
			return;
		}

		const requestUrl = new URL(req.url || "/", "http://localhost");
		let filePath = resolvePath(requestUrl.pathname);

		try {
			const fileStat = await stat(filePath);
			if (fileStat.isDirectory()) {
				filePath = join(filePath, "index.html");
			}
		} catch {
			filePath = indexFile;
		}

		if (req.method === "HEAD") {
			const fileExt = extname(filePath).toLowerCase();
			const contentType = mimeTypes.get(fileExt) || "application/octet-stream";
			res.writeHead(200, securityHeaders(contentType));
			res.end();
			return;
		}

		await serveFile(res, filePath);
	} catch (error) {
		res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
		res.end(`Internal Server Error: ${error.message}`);
	}
}

try {
	execFileSync(process.execPath, ["build.js"], { stdio: "inherit" });
} catch (error) {
	process.exitCode = 1;
	throw error;
}

createServer(handleRequest).listen(port, host, () => {
	console.log(`Bloxdviolet is running on http://${host}:${port}`);
	console.log(`Open http://localhost:${port} in your browser.`);
});
