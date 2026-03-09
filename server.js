// Wrapper for Render deployment - delegates to Next.js standalone server
const path = require("path");

// Set hostname and port for Render
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

// Load the Next.js standalone server
require(path.join(__dirname, ".next", "standalone", "server.js"));
