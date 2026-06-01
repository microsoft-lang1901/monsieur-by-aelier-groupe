import { networkInterfaces } from "node:os";

const port = process.argv[2] ?? "8082";
const addresses = Object.values(networkInterfaces())
  .flat()
  .filter((address) => address && address.family === "IPv4" && !address.internal)
  .map((address) => address.address);

if (addresses.length === 0) {
  console.log(`No LAN IPv4 address found. Local preview: http://127.0.0.1:${port}`);
  process.exit(0);
}

for (const address of addresses) {
  console.log(`Phone preview: http://${address}:${port}`);
}
