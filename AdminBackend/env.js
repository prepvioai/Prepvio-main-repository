import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, ".env");

if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    console.log("DEBUG: env.js - dotenv loading:", result.error ? "FAILED" : "SUCCESS");
    console.log("DEBUG: env.js - .env path used:", envPath);
} else {
    console.log("DEBUG: env.js - .env file not found, skipping dotenv config (expected in production)");
}

console.log("DEBUG: env.js - JWT_SECRET loaded:", process.env.JWT_SECRET ? "Yes" : "No");
