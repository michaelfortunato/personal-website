import { getGitDir } from "@/lib/server-only/buildInfo";
import path from "path";
import {
  _typstFileToHTMLFile,
  buildPost,
  getCommitInfoForFileOrFallback,
} from "@/lib/server-only/posts";

async function main() {
  const root = await getGitDir();
  const fp = path.join(root, `posts/test.typ`);
  // const info = getCommitInfoForFileOrFallback(fp);
  const html = await buildPost(fp);
  console.log(html);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
