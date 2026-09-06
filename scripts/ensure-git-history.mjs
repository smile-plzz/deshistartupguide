#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureFullGitHistory, gitRepositoryState } from "./git-content-dates.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

try {
  const before = ensureFullGitHistory(root);

  if (!before.available) {
    console.log("Git metadata unavailable; no history fetch attempted.");
  } else if (before.fetched) {
    console.log("Full Git history fetched for accurate SEO dates.");
  } else {
    console.log("Git history is complete.");
  }
} catch (error) {
  const state = gitRepositoryState(root);
  console.warn(
    "git-content-dates: could not ensure full history (" +
      (error instanceof Error ? error.message : String(error)) +
      "). Continuing with " +
      (state.shallow ? "shallow" : "partial") +
      " history; SEO dates may fall back to frontmatter."
  );
  // Never fail CI/Vercel solely because unshallow is unavailable.
  process.exitCode = 0;
}
