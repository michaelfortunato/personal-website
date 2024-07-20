import { None, Ok, Option, Result, Some } from "ts-results-es";
import { SQLQueryable } from "./persistence";
import Page from "./page";
import { tryAsync } from "./utils";

export interface PageRepository<P> {
  get(id: string, ctx: P): Promise<Result<Option<Page>, Error>>;
  exists(id: string, ctx: P): Promise<Result<boolean, Error>>;
  insert(t: Page, ctx: P): Promise<Result<Page, Error>>;
  delete(id: string, ctx: P): Promise<Result<Page, Error>>;
}

export class PageSQLRepository<P extends SQLQueryable>
  implements PageRepository<P>
{
  get(id: string, ctx: P): Promise<Result<Option<Page>, Error>> {
    const result = tryAsync(() =>
      ctx
        .query<Page>("SELECT * from page WHERE url = $1", [id])
        .then((result) =>
          result.rows.length == 0
            ? None
            : Some({
                url: result.rows[0].url,
                createdAt: result.rows[0].createdAt,
                modifiedAt: result.rows[0].modifiedAt,
              } as Page),
        ),
    );
    return result;
  }
  exists(id: string, ctx: P): Promise<Result<boolean, Error>> {
    const result = tryAsync(() =>
      ctx
        .query<Page>("SELECT url from page WHERE url = $1", [id])
        .then((result) => result.rows.length > 0),
    );
    return result;
  }
  async insert(page: Page, ctx: P): Promise<Result<Page, Error>> {
    const result = await tryAsync(() =>
      ctx.query<Page>(
        "INSERT INTO page(url, created_at, modified_at) VALUES ($1, $2, $3)",
        [page.url, page.createdAt, page.modifiedAt],
      ),
    );
    if (result.isErr()) {
      return result;
    }
    // FIXME: This should probably be the "page" constructed from the db and not just a copy back from the user input
    return Ok(page);
  }
  delete(id: string, ctx: P): Promise<Result<Page, Error>> {
    return tryAsync(() =>
      ctx
        .query<Page>("DELETE FROM page WHERE url = $2;", [id])
        .then((result) => {
          if (result.rows.length != 1) {
            throw new Error("Pg did not return one row. It should");
          }
          const row = result.rows[0];
          return {
            url: row.url,
            createdAt: new Date(row.createdAt),
            modifiedAt: new Date(row.modifiedAt),
          } as Page;
        }),
    );
  }
}

export default PageSQLRepository;
