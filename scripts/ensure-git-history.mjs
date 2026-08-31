#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureFullGitHistory } from "./git-content-dates.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const before = ensureFullGitHistory(root);

if (!before.available) {
  console.log("Git metadata unavailable; no history fetch attempted.");
} else if (before.fetched) {
  console.log("Full Git history fetched for accurate SEO dates.");
} else {
  console.log("Git history is complete.");
}
