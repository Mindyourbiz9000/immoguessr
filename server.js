// This file exists for deployment platforms (like Render) that default to `node server.js`.
// It starts the Next.js production server using the child_process module.
const { execSync } = require("child_process");
const port = process.env.PORT || 3000;
execSync(`npx next start -p ${port} -H 0.0.0.0`, { stdio: "inherit" });
