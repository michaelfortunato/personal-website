import { exit } from "process";
import fs from "fs";
import path from "path";
import PostService, { renderMarkdownToHTML } from "./lib/postService";
import { tryAsync } from "./lib/utils";
import { getPGClient as getClient } from "./lib/persistence";
import { PostSQLRepository as PostRepository } from "./lib/post/repository";
import { globSync } from "glob";
import matter from "gray-matter";
import { Some } from "ts-results-es";

const POST_DIRECTORY = path.join(process.cwd(), "posts");

async function main() {
  try {
    const dbClient = (await getClient()).unwrap();
    const postService = new PostService(dbClient, new PostRepository());
    const fileNames = fs
      .readdirSync(POST_DIRECTORY)
      .filter((path) => path.includes(".md"));
    const postRepo = new PostRepository();
    const result = await Promise.all(
      fileNames.map(async (fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, "");
        // Read markdown file as string
        const fullPath = path.join(POST_DIRECTORY, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data: frontMatter, content: rawContent } = matter(fileContents);
        const title = frontMatter.title || fileName;
        const content = await renderMarkdownToHTML(rawContent);
        const tags = frontMatter.tags;
        // Before creating, check if it exists
        const exists = await postRepo.getByTitle("0", title, dbClient);
        if (exists.isErr()) {
          return exists;
        }
        if (exists.value.isNone()) {
          console.log("Does not exist!");
          return postService.createPost({
            author_id: "0",
            title,
            content,
            tags,
          });
        }
        console.log("exists already!");
        const post = exists.value.unwrap();
        post.title = title;
        post.content = Some(content);
        post.tags = tags;
        return postRepo.update(post, dbClient);
      }),
    );
    console.log(result);

    exit(0);
  } catch (e) {
    console.error(e);
    exit(1);
  }
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
