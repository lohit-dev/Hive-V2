import { getDefaultConfig } from "expo/metro-config.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = getDefaultConfig(__dirname);

export default config;
