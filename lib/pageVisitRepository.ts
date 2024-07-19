import { None, Ok, Option, Result, Some } from "ts-results-es";
import { SQLQueryable, SQLModelInfo } from "./persistence";
import PageVisit from "./pageVisit";
import { tryAsync } from "./utils";

export interface PageVisitRepository<P> {
  get(
    pageUrl: string,
    visitorIP: string,
    ctx: P,
  ): Promise<Result<Option<PageVisit>, Error>>;
  insert(pageVisit: PageVisit, ctx: P): Promise<Result<PageVisit, Error>>;
  update(pageVisit: PageVisit, ctx: P): Promise<Result<PageVisit, Error>>;
}

export class PageVisitSQLRepository<P extends SQLQueryable>
  implements PageVisitRepository<P>
{
  async get(
    pageUrl: string,
    visitorIP: string,
    ctx: P,
  ): Promise<Result<Option<PageVisit>, Error>> {
    const result = tryAsync(() =>
      ctx
        .query<PageVisit>(
          "SELECT * from page_visit WHERE page_url = $1 AND visitor_ip = $2",
          [pageUrl, visitorIP],
        )
        .then((result) =>
          result.rows.length == 0
            ? None
            : Some(
                new PageVisit(
                  result.rows[0].page_url,
                  result.rows[0].visitor_ip,
                  result.rows[0].first_visited,
                  result.rows[0].last_visited,
                  result.rows[0].number_of_visits,
                ),
              ),
        ),
    );
    return result;
  }
  async insert(
    pageVisit: PageVisit,
    ctx: P,
  ): Promise<Result<PageVisit, Error>> {
    const result = await tryAsync(() =>
      ctx.query<PageVisit>(
        "INSERT INTO page_visit(page_url, visitor_ip, first_visited, last_visited, number_of_visits, reaction) VALUES($1, $2, $3, $4, $5, $6);",
        [
          pageVisit.page_url,
          pageVisit.visitor_ip,
          pageVisit.first_visited,
          pageVisit.last_visited,
          pageVisit.number_of_visits,
          pageVisit.reaction,
        ],
      ),
    );
    if (result.isErr()) {
      return result;
    }
    return Ok(pageVisit);
  }
  async update(
    pageVisit: PageVisit,
    ctx: P,
  ): Promise<Result<PageVisit, Error>> {
    const result = await tryAsync(() =>
      ctx.query<PageVisit>(
        "UPDATE page_visit SET page_url = $1, visitor_ip = $2, first_visited = $3, last_visited = $4, number_of_visits = $5, reaction = $6 WHERE page_url = $1 AND visitor_ip = $2;",
        [
          pageVisit.page_url,
          pageVisit.visitor_ip,
          pageVisit.first_visited,
          pageVisit.last_visited,
          pageVisit.number_of_visits,
          pageVisit.reaction,
        ],
      ),
    );
    if (result.isErr()) {
      return result;
    }
    return Ok(pageVisit);
  }
}

export default PageVisitRepository;
