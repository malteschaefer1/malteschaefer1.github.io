#!/usr/bin/env node

/**
 * Fetch README preview images and repository metadata so the Coding section
 * can render tiles automatically. Run locally with a GitHub token:
 *
 *   GITHUB_TOKEN=XXXX node scripts/update_repo_data.js
 *
 * The GitHub Actions workflow runs this on every push.
 */

const fs = require("fs/promises");
const path = require("path");

const OWNER = process.env.GITHUB_OWNER || "malteschaefer1";
const TOKEN =
  process.env.GITHUB_TOKEN ||
  process.env.GH_TOKEN ||
  process.env.PERSONAL_ACCESS_TOKEN ||
  "";
const API_ROOT = "https://api.github.com";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "repo-tiles-updater",
};

if (TOKEN) {
  headers.Authorization = `Bearer ${TOKEN}`;
} else {
  console.warn(
    "⚠️  No GitHub token provided. Requests may be rate limited or miss private repos."
  );
}

async function fetchJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`${res.status} ${res.statusText} for ${url}: ${message}`);
  }
  return res.json();
}

async function fetchAllRepos(owner) {
  const repos = [];
  let page = 1;

  while (true) {
    const url = `${API_ROOT}/users/${owner}/repos?per_page=100&page=${page}`;
    const batch = await fetchJson(url);
    if (!Array.isArray(batch) || batch.length === 0) break;

    repos.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return repos;
}

function findReferenceImages(markdown) {
  const refs = {};
  const refPattern = /^\s*\[([^\]]+)]:\s*(\S+)/gm;
  let match;

  while ((match = refPattern.exec(markdown)) !== null) {
    refs[match[1].toLowerCase()] = match[2];
  }

  return refs;
}

function resolveToRaw(url, repo) {
  if (!url || url.startsWith("#") || url.startsWith("data:")) return null;
  const trimmed = url.replace(/^</, "").replace(/>$/, "");

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const base = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/`;
  try {
    return new URL(trimmed.replace(/^\.\//, ""), base).toString();
  } catch {
    return null;
  }
}

function extractImageFromReadme(readmeContent, repo) {
  const referenceMap = findReferenceImages(readmeContent);

  // ![alt](path "title")
  const mdMatch = readmeContent.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (mdMatch && mdMatch[1]) {
    const candidate = mdMatch[1].split(/\s+/)[0];
    const resolved = resolveToRaw(candidate, repo);
    if (resolved) return resolved;
  }

  // ![alt][ref]
  const refMatch = readmeContent.match(/!\[[^\]]*]\[([^\]]+)]/);
  if (refMatch && refMatch[1]) {
    const ref = referenceMap[refMatch[1].toLowerCase()];
    const resolved = resolveToRaw(ref, repo);
    if (resolved) return resolved;
  }

  // <img src="...">
  const htmlMatch = readmeContent.match(
    /<img[^>]+src=["']?([^"'>\s]+)["']?[^>]*>/i
  );
  if (htmlMatch && htmlMatch[1]) {
    const resolved = resolveToRaw(htmlMatch[1], repo);
    if (resolved) return resolved;
  }

  return null;
}

async function fetchReadmeImage(repo) {
  const url = `${API_ROOT}/repos/${repo.full_name}/readme`;
  const res = await fetch(url, { headers });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    console.warn(
      `Skipping README for ${repo.full_name} (${res.status} ${res.statusText}): ${body}`
    );
    return null;
  }

  const payload = await res.json();
  if (!payload.content) return null;

  const content = Buffer.from(payload.content, "base64").toString("utf8");
  return extractImageFromReadme(content, repo);
}

async function main() {
  console.log(`Fetching repositories for ${OWNER}...`);
  const repos = await fetchAllRepos(OWNER);
  console.log(`Found ${repos.length} repos. Checking README images...`);

  const repoData = {};

  for (const repo of repos) {
    const image = await fetchReadmeImage(repo);
    repoData[repo.name] = {
      image: image || null,
      pushed_at: repo.pushed_at,
      default_branch: repo.default_branch,
    };
    console.log(
      `${repo.full_name} -> ${image ? "image found" : "no image found"}`
    );
  }

  const outputPath = path.join(
    __dirname,
    "..",
    "_data",
    "repo_data.json"
  );
  const serialized = `${JSON.stringify(repoData, null, 2)}\n`;

  await fs.writeFile(outputPath, serialized, "utf8");
  console.log(`Wrote ${Object.keys(repoData).length} entries to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
