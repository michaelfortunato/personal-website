import { None, Ok, Option, Result, Some } from "ts-results-es";
import { SQLQueryable } from "../persistence";
import Post from "./post";
import { tryAsync } from "@/lib/utils";

export interface PostRepository<P> {
  get(id: string, ctx: P): Promise<Result<Option<Post>, Error>>;
  getByTitle(
    author_id: string,
    title: string,
    ctx: P,
  ): Promise<Result<Option<Post>, Error>>;
  exists(id: string, ctx: P): Promise<Result<boolean, Error>>;
  insert(t: NewPost, ctx: P): Promise<Result<Post, Error>>;
  delete(id: string, ctx: P): Promise<Result<Post, Error>>;
  update(post: Post, ctx: P): Promise<Result<Post, Error>>;
}

export type NewPost = {
  author_id: string;
  title: string;
  content: string;
  tags: string[];
};

export class PostSQLRepository<P extends SQLQueryable>
  implements PostRepository<P>
{
  get(id: string, ctx: P): Promise<Result<Option<Post>, Error>> {
    const result = tryAsync(() =>
      ctx
        .query<Post>("SELECT * from page WHERE url = $1", [id])
        .then((result) =>
          result.rows.length == 0
            ? None
            : Some({
                url: result.rows[0].url,
                createdAt: result.rows[0].createdAt,
                modifiedAt: result.rows[0].modifiedAt,
              } as Post),
        ),
    );
    return result;
  }
  getByTitle(
    author_id: string,
    title: string,
    ctx: P,
  ): Promise<Result<Option<Post>, Error>> {
    const result = tryAsync(() =>
      ctx
        .query<Post>("SELECT * from post WHERE author_id = $1 AND title = $2", [
          author_id,
          title,
        ])
        .then((result) =>
          result.rows.length == 0
            ? None
            : Some(
                new Post(
                  result.rows[0].id,
                  result.rows[0].author_id,
                  result.rows[0].title,
                  false,
                  result.rows[0].content,
                  result.rows[0].tags,
                ),
              ),
        ),
    );
    return result;
  }
  exists(id: string, ctx: P): Promise<Result<boolean, Error>> {
    const result = tryAsync(() =>
      ctx
        .query<Post>("SELECT url from page WHERE url = $1", [id])
        .then((result) => result.rows.length > 0),
    );
    return result;
  }
  async insert(new_post: NewPost, ctx: P): Promise<Result<Post, Error>> {
    const result = await tryAsync(() =>
      ctx.query<Post>(
        `INSERT INTO post(author_id, title, content, tags) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *;`,
        [new_post.author_id, new_post.title, new_post.content, new_post.tags],
      ),
    );
    if (result.isErr()) {
      return result;
    }
    const rs = result.unwrap();
    return Ok(rs.rows[0]);
  }
  async update(post: Post, ctx: P): Promise<Result<Post, Error>> {
    const result = await tryAsync(() =>
      ctx.query<Post>(
        `UPDATE post
        SET author_id = $1, title = $2, content = $3,
        tags = $4
        WHERE id = $5
        RETURNING *;`,
        [post.author_id, post.title, post.content, post.tags, post.id],
      ),
    );
    if (result.isErr()) {
      return result;
    }
    const rs = result.unwrap();
    return Ok(rs.rows[0]);
  }
  delete(id: string, ctx: P): Promise<Result<Post, Error>> {
    return tryAsync(() =>
      ctx
        .query<Post>("DELETE FROM page WHERE url = $2;", [id])
        .then((result) => {
          if (result.rows.length != 1) {
            throw new Error("Pg did not return one row. It should");
          }
          const row = result.rows[0];
          return {
            url: row.url,
            createdAt: new Date(row.createdAt),
            modifiedAt: new Date(row.modifiedAt),
          } as Post;
        }),
    );
  }
}

export default PostSQLRepository;
