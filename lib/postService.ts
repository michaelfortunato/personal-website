import { Plugin, unified } from "unified";
import { Context } from "./persistence";
import { NewPost, PostRepository } from "./post/repository";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { Root } from "remark-gfm/lib";
import Post from "./post/post";
import { Err, Ok, Result } from "ts-results-es";

// Custom Remark plugin to insert metadata
const assertAndExtractTopHeader: Plugin<[], Root> = () => {
  return (tree, file) => {
    if (tree.children.length == 0) {
      throw "Invalid markdown: no children";
    }
    let firstChild = tree.children[0];
    if (firstChild.type != "heading") {
      throw "Invalid markdown: first child must be a header";
    }
    if (firstChild.depth != 1) {
      throw "Invalid markdown: first child must be a top level (1) header";
    }
    if (firstChild.children.length == 0) {
      throw "Invalid markdown: heading must have content";
    }
    let textNode = firstChild.children[0];
    if (textNode.type != "text") {
      throw "Invalid markdown: heading content must be text";
    }
    const title = textNode.value;
    file.data.title = title;
    tree.children.shift();
  };
};

export async function renderMarkdownToHTML(text: string): Promise<string> {
  const contentObj = await unified()
    .use(remarkParse)
    // .use(assertAndExtractTopHeader)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(text);
  return contentObj.toString();
}

export default class PostService<P extends Context> {
  private readonly ctx: P;
  private readonly postRepo: PostRepository<P>;
  constructor(db: P, postRepo: PostRepository<P>) {
    this.ctx = db;
    this.postRepo = postRepo;
  }
  async createPost(new_post: NewPost): Promise<Result<Post, Error>> {
    try {
      await this.ctx.start();
      const post = (await this.postRepo.insert(new_post, this.ctx)).unwrap();
      await this.ctx.commit();
      return Ok(post);
    } catch (e) {
      await this.ctx.rollback();
      return Err(new Error(`Could not create post: ${e}`));
    }
  }
  async render<T extends (text: string) => Promise<string>>(
    text: string,
    renderer: T,
  ): Promise<string> {
    return await renderer(text);
  }
}
