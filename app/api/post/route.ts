import { getPGClient as getClient } from "@/lib/persistence";
import { NextRequest } from "next/server";
import PostService, { renderMarkdownToHTML } from "@/lib/postService";
import {
  NewPost,
  PostSQLRepository as PostRepository,
} from "@/lib/post/repository";

type CreatePost = NewPost & { plain_text: string };

/// Record a new visit to the site
export async function POST(request: NextRequest) {
  const dbClientRes = await getClient();
  if (dbClientRes.isErr()) {
    return Response.json({ res: dbClientRes.toString() });
  }
  const dbClient = dbClientRes.value;

  const service = new PostService(dbClient, new PostRepository());
  const newPost: CreatePost = await request.json();
  newPost.content = await renderMarkdownToHTML(newPost.plain_text);
  const result = await service.createPost(newPost);
  if (result.isErr()) {
    const error = result.error;
    return Response.json({ message: error.message }, { status: 404 });
  }
  return Response.json(result.value);
}
