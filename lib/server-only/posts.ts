import fs from "fs";
import path from "path";
import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified, Plugin } from "unified";
import { Root } from "remark-parse/lib";
import {
  createMetadata,
  type FrontMatter,
  type Metadata,
  type Post,
} from "@/lib/posts";
import { getCommitEntryForFile } from "@/lib/server-only/buildInfo";

export const postsDirectory = path.join(process.cwd(), "posts");

const typstContentDirectory = path.join(process.cwd(), "content", "typst");
const typstBuildDirectory = path.join(process.cwd(), "public", "typst");

function getTypstPaths(id: string) {
  const sourcePath = path.join(typstContentDirectory, id, "index.typ");
  const metaPath = path.join(typstContentDirectory, id, "meta.json");
  const htmlPath = path.join(typstBuildDirectory, id, "html", "index.html");
  return { sourcePath, metaPath, htmlPath };
}

export async function getPostData(id: string): Promise<Post> {
  return getTypstPostData(id);
}

async function getTypstPostData(id: string): Promise<Post> {
  const { sourcePath, metaPath, htmlPath } = getTypstPaths(id);
  if (!fs.existsSync(metaPath)) {
    throw `Typst post is missing metadata: ${metaPath}`;
  }
  if (!fs.existsSync(sourcePath)) {
    throw `Typst post is missing source: ${sourcePath}`;
  }
  if (!fs.existsSync(htmlPath)) {
    throw `Typst post is missing compiled HTML. Run \`npm run rheo:build\`.\nMissing: ${htmlPath}`;
  }

  const metaJson = fs.readFileSync(metaPath, "utf-8");
  const meta = JSON.parse(metaJson) as FrontMatter;
  const title = meta.title ?? id;

  const { firstCommit, currentCommit } =
    getCommitInfoForFileOrFallback(sourcePath);
  const metadata = createMetadata(id, title, meta, currentCommit, firstCommit);

  const iframeSrc = `/typst/${id}/html/index.html`;
  const iframeHtml = `
<div class="not-prose flex justify-end">
  <a class="text-sm underline" href="${iframeSrc}" target="_blank" rel="noreferrer">Open Typst render</a>
</div>
<iframe class="mt-4 h-[80vh] w-full rounded border bg-white" src="${iframeSrc}" title="${title}" loading="lazy"></iframe>
`;

  return {
    metadata,
    content: iframeHtml,
    format: "typst",
  };
}

export async function getAllPostIds() {
  const typstIds = getTypstPostIds();
  const allIds = [...typstIds];

  const seen = new Set<string>();
  for (const id of allIds) {
    if (seen.has(id)) {
      throw `Duplicate post id detected: ${id}`;
    }
    seen.add(id);
  }

  return allIds.map((id) => ({ params: { id } }));
}

export async function getAllPostsMetadata(): Promise<Metadata[]> {
  const typstPosts = getTypstPostIds().map(async (id) => {
    const { sourcePath, metaPath } = getTypstPaths(id);
    const metaJson = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(metaJson) as FrontMatter;
    const title = meta.title ?? id;

    const { firstCommit, currentCommit } =
      getCommitInfoForFileOrFallback(sourcePath);
    return createMetadata(id, title, meta, currentCommit, firstCommit);
  });

  const allPostsData: Metadata[] = await Promise.all([...typstPosts]);
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.createdTimestamp < b.createdTimestamp) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Custom Remark plugin to insert metadata
const assertAndExtractTopHeader: Plugin<[], Root> = () => {
  return (tree, file) => {
    if (tree.children.length == 0) {
      throw "Invalid markdown: no children";
    }
    const firstChild = tree.children[0];
    if (firstChild.type != "heading") {
      throw "Invalid markdown: first child must be a header";
    }
    if (firstChild.depth != 1) {
      throw "Invalid markdown: first child must be a top level (1) header";
    }
    if (firstChild.children.length == 0) {
      throw "Invalid markdown: heading must have content";
    }
    const textNode = firstChild.children[0];
    if (textNode.type != "text") {
      throw "Invalid markdown: heading content must be text";
    }
    const title = textNode.value;
    file.data.title = title;
    tree.children.shift();
  };
};

function getMarkdownPostIds(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

function getTypstPostIds(): string[] {
  if (!fs.existsSync(typstContentDirectory)) return [];
  return fs
    .readdirSync(typstContentDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((id) => {
      const { sourcePath, metaPath, htmlPath } = getTypstPaths(id);
      return (
        fs.existsSync(sourcePath) &&
        fs.existsSync(metaPath) &&
        fs.existsSync(htmlPath)
      );
    });
}

function getCommitInfoForFileOrFallback(filepath: string) {
  const firstCommit = getCommitEntryForFile(filepath, false);
  const currentCommit = getCommitEntryForFile(filepath, true);
  if (firstCommit && currentCommit) {
    return { firstCommit, currentCommit };
  }

  const nowSeconds = Math.floor(Date.now() / 1000).toString();
  const fallbackCommit = {
    commitHash: "UNCOMMITTED",
    get shortCommitHash() {
      return this.commitHash.slice(0, 7);
    },
    author: "local",
    timestamp: nowSeconds,
    message: "Uncommitted changes",
  };

  return {
    firstCommit: firstCommit ?? fallbackCommit,
    currentCommit: currentCommit ?? fallbackCommit,
  };
}
