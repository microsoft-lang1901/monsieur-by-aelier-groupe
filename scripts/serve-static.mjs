import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "dist-web");
const port = Number(process.argv[3] ?? 8082);
const host = process.argv[4] ?? "0.0.0.0";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ttf": "font/ttf"
};

createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url ?? "/", `http://localhost:${port}`).pathname);
  const candidate = normalize(join(root, requestPath === "/" ? "index.html" : requestPath));
  const filePath = candidate.startsWith(root) && existsSync(candidate) && statSync(candidate).isFile() ? candidate : join(root, "index.html");

  response.setHeader("Content-Type", contentTypes[extname(filePath)] ?? "application/octet-stream");
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});
