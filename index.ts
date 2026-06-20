import concurrently from "concurrently";

concurrently([
  {
    name: "server",
    command: "bun run dev",
    prefixColor: "bgGreen",
    cwd: "packages/server",
  },
  {
    name: "client",
    command: "bun run dev",
    prefixColor: "bgMagenta",
    cwd: "packages/client",
  },
]);
