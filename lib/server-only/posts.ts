import { promisify } from "util";
import path from "path";
import { execFile } from "child_process";
import * as cheerio from "cheerio";
const execFileAsync = promisify(execFile);
import { readdir } from "fs/promises";

import {
  getCommitEntryForFile,
  getGitDir,
  isDirty as isDirtyFunc,
} from "./buildInfo";
import { Metadata, Post } from "@/lib/posts";

export function getCommitInfoForFileOrFallback(filepath: string) {
  const firstCommit = getCommitEntryForFile(filepath, false);
  const currentCommit = getCommitEntryForFile(filepath, true);
  const isDirty = isDirtyFunc(filepath);
  if (firstCommit && currentCommit) {
    return { isDirty, firstCommit, currentCommit };
  }

  const nowSeconds = Math.floor(Date.now() / 1000).toString();
  const fallbackCommit = {
    commitHash: "UNCOMMITTED",
    get shortCommitHash() {
      return this.commitHash.slice(0, 7);
    },
    author: "Michael Fortunato (unverified)",
    timestamp: nowSeconds,
    message: "Uncommited/non-existant file",
  };

  return {
    isDirty,
    firstCommit: firstCommit ?? fallbackCommit,
    currentCommit: currentCommit ?? fallbackCommit,
  };
}

//////////////////////////////////////////////////////////////////////////////
//                   This all supports building the blog from typst
//////////////////////////////////////////////////////////////////////////////

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (isRecord(v) && typeof v.value === "string") return v.value;
  if (isRecord(v) && typeof v.text === "string") return v.text;
  return undefined;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(asString).filter(Boolean) as string[];
  const s = asString(v);
  return s ? [s] : [];
}

function normalizeLabel(label: unknown): string | null {
  if (typeof label !== "string") return null;
  return label.replace(/^<|>$/g, "").toUpperCase(); // "<TITLE>" -> "TITLE"
}

function findLabelValue(items: unknown[], ...labels: string[]): unknown {
  const targets = labels.map((l) => l.toUpperCase());
  for (const item of items) {
    if (!isRecord(item)) continue;

    const direct = normalizeLabel(item.label);
    const nested = isRecord(item.value)
      ? normalizeLabel(item.value.label)
      : null;

    if (
      (direct && targets.includes(direct)) ||
      (nested && targets.includes(nested))
    ) {
      if ("value" in item) return item.value;
      if ("text" in item) return item.text;
      return item;
    }
  }
  return undefined;
}

// --- typst query + parse ---
export async function _typstQuery(typstFilepath: string): Promise<unknown[]> {
  const TYPST_QUERY =
    "selector(<KEYWORDS>).or(<keywords>).or(<tags>).or(<TITLE>).or(<title>)";
  const root = await getGitDir();
  const { stdout } = await execFileAsync("typst", [
    "query",
    typstFilepath,
    TYPST_QUERY,
    "--format",
    "json",
    "--root",
    root,
  ]);
  return JSON.parse(stdout);
}

// Typst compile -> stdout (no temp files)
export async function _typstFileToHTMLFile(
  typstFilepath: string,
): Promise<string> {
  const root = await getGitDir();
  const { stdout } = await execFileAsync(
    "typst",
    [
      "compile",
      "--root",
      root,
      "--format=html",
      "--features=html",
      typstFilepath,
      "-", // stdout
    ],
    { maxBuffer: 50 * 1024 * 1024 },
  );

  return stdout;
}

export async function postPathFromId(id: string): Promise<string> {
  const gitRoot = await getGitDir();

  // normalize to OS separators
  const normalized = id.split("/").join(path.sep);

  return path.join(gitRoot, "posts", `${normalized}.typ`);
}
export async function idFromPostPath(absPath: string): Promise<string> {
  const gitRoot = await getGitDir();
  const rel = path.relative(gitRoot, path.normalize(absPath)); // e.g. "posts/foo/bar.typ"
  const noExt = rel.replace(/\.typ$/, "");

  // strip leading "posts/" (or "posts\" on Windows)
  const stripped = noExt.replace(/^posts[\\/]/, "");

  // normalize to URL-style slashes
  return stripped.split(path.sep).join("/");
}

export async function _typstFileToMetadata(typstFilepath: string) {
  const items = await _typstQuery(typstFilepath);

  return {
    id: (await idFromPostPath(typstFilepath)) || "<UNKNOWN ID>",
    title: asString(findLabelValue(items, "TITLE")) || "<UNKNOWN TITLE>",
    tags: asStringArray(findLabelValue(items, "KEYWORDS", "TAGS")),
  };
}
function splitHeadBody(html: string) {
  const $ = cheerio.load(html);
  return {
    head: $("head").html() ?? "",
    body: $("body").html() ?? "",
  };
}

export async function listPostFiles(): Promise<string[]> {
  const root = await getGitDir();
  const postsDir = path.join(root, "posts");
  const results: string[] = [];

  function shouldSkip(name: string) {
    return name.startsWith("_");
  }

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (shouldSkip(entry.name)) continue;

      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".typ")) {
        results.push(full);
      }
    }
  }

  await walk(postsDir);
  return results;
}

export async function listPostIds(): Promise<string[]> {
  const files = await listPostFiles();
  return Promise.all(files.map((file) => idFromPostPath(file)));
}

export async function buildPost(inputFilepath: string): Promise<Post> {
  const htmlString = await _typstFileToHTMLFile(inputFilepath);
  const headAndBody = splitHeadBody(htmlString);
  const { id, title, tags } = await _typstFileToMetadata(inputFilepath);
  const buildInfo = getCommitInfoForFileOrFallback(inputFilepath);
  const metadata = new Metadata({ id, title, tags, buildInfo });
  return {
    content: headAndBody,
    metadata,
  };
}
