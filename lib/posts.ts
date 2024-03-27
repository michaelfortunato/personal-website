import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export const postsDirectory = path.join(process.cwd(), "db");

export type PostFrontMatter = {
  id: string;
  /// The title of the post
  title: string;
  /// The date when the post was created
  createdTimestamp: string;
  /// The date when the post was last modified
  modifiedTimestamp: string;
  [key: string]: any; // TODO: Type correctly
};

export type PostData = {
  frontMatter: PostFrontMatter;
  renderedContent: string; // Rendered file contents, most likely as rendered html
  [key: string]: any; // TODO: Type correctly
};

async function renderMarkdownToHTML(content: string) {
  const contentObj = await remark().use(html).process(content);
  return contentObj.toString();
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const renderedContent = await renderMarkdownToHTML(matterResult.content);
  console.log(matterResult);

  return {
    frontMatter: matterResult.data as PostFrontMatter,
    renderedContent,
  };
}

export async function getAllPostIds() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getAllPosts(): Promise<PostFrontMatter[]> {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: PostFrontMatter[] = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    const postFrontMatter: PostFrontMatter = {
      id,
      ...matterResult.data,
    } as PostFrontMatter; // Need to cast this
    return postFrontMatter;
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
