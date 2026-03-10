// This file exists for deployment platforms (like Render) that default to `node server.js`.
// It simply loads the Next.js standalone server produced by `output: "standalone"` in next.config.ts.
require("./.next/standalone/server.js");
