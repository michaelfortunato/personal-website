import { getGitDir } from "@/lib/server-only/buildInfo";
import path from "path";
import {
  _typstFileToHTMLFile,
  buildPost,
  getCommitInfoForFileOrFallback,
  listPostIds,
} from "@/lib/server-only/posts";

async function main() {
  const root = await getGitDir();
  const fp = path.join(root, `posts/test.typ`);
  // const info = getCommitInfoForFileOrFallback(fp);
  const postIds = await listPostIds();
  console.log(postIds);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
