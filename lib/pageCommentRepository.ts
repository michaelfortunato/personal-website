import { SQLQueryable } from "./persistence";
import Visitor from "./visitor";
import { tryAsync } from "./utils";
import { Err, None, Option, Result, Some } from "ts-results-es";
import PageComment from "./pageComment";

type PageCommentRow = PageComment & { text: string };

export interface PageCommentRepository<P> {
  get(id: string, ctx: P): Promise<Result<Option<PageComment>, Error>>;
  exists(id: string, ctx: P): Promise<Result<boolean, Error>>;
  insert(
    visitorIp: string,
    pageUrl: string,
    text: string,
    ctx: P,
  ): Promise<Result<PageComment, Error>>;
  update(id: string, text: string, ctx: P): Promise<Result<PageComment, Error>>;
  delete(id: string, ctx: P): Promise<Result<PageComment, Error>>;
}

export class PageCommentSQLRepository<P extends SQLQueryable>
  implements PageCommentRepository<P>
{
  get(id: string, ctx: P): Promise<Result<Option<PageComment>, Error>> {
    // I prefer Promise<Option<T>> but we get some free methods with AsyncOption
    const result = tryAsync(() =>
      ctx
        .query<PageCommentRow>("SELECT * from page_comment WHERE id = $1", [id])
        .then((result) =>
          result.rows.length == 0
            ? None
            : Some(
                new PageComment(
                  id,
                  result.rows[0].visitorIp,
                  result.rows[0].pageUrl,
                  result.rows[0].text,
                ),
              ),
        ),
    );
    return result;
  }
  exists(id: string, ctx: P): Promise<Result<boolean, Error>> {
    const result = tryAsync(() =>
      ctx
        .query<Visitor>("SELECT ip from page_comment WHERE id = $1;", [id])
        .then((result) => result.rows.length > 0),
    );
    return result;
  }
  insert(
    visitorIp: string,
    pageUrl: string,
    text: string,
    ctx: P,
  ): Promise<Result<PageComment, Error>> {
    // I prefer Promise<Option<T>> but we get some free methods with AsyncOption
    const result = tryAsync(() =>
      ctx
        .query<PageCommentRow>(
          "INSERT INTO page_comment(page_url, visitor_ip, text) VALUES($1, $2, $3);",
          [pageUrl, visitorIp, text],
        )
        .then((result) => {
          if (result.rows.length != 1) {
            throw new Error("Pg did not return one row. It should");
          }
          const row = result.rows[0];
          return new PageComment(row.id, row.visitorIp, row.pageUrl, row.text);
        }),
    );
    return result;
  }
  update(
    id: string,
    text: string,
    ctx: P,
  ): Promise<Result<PageComment, Error>> {
    return tryAsync(() =>
      ctx
        .query<PageCommentRow>(
          "UPDATE page_comment SET (text = $1) WHERE id = $2;",
          [text, id],
        )
        .then((result) => {
          if (result.rows.length != 1) {
            throw new Error("Pg did not return one row. It should");
          }
          const row = result.rows[0];
          return new PageComment(row.id, row.visitorIp, row.pageUrl, row.text);
        }),
    );
  }
  delete(id: string, ctx: P): Promise<Result<PageComment, Error>> {
    return tryAsync(() =>
      ctx
        .query<PageCommentRow>("DELETE FROM page_comment  WHERE id = $2;", [id])
        .then((result) => {
          if (result.rows.length != 1) {
            throw new Error("Pg did not return one row. It should");
          }
          const row = result.rows[0];
          return new PageComment(row.id, row.visitorIp, row.pageUrl, row.text);
        }),
    );
  }
}
