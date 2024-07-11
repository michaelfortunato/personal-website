import { None, Ok, Option, Result, Some } from "ts-results-es";
import { SQLQueryable } from "./persistence";
import Repository from "./repository";
import Visitor from "./visitor";
import { tryAsync } from "./utils";

interface VisitorRepository<P> {
  get(id: string, ctx: P): Promise<Result<Option<Visitor>, Error>>;
  exists(id: string, ctx: P): Promise<Result<boolean, Error>>;
  insert(visitor: Visitor, ctx: P): Promise<Result<Visitor, Error>>;
  delete(id: string): Promise<Result<null, Error>>;
}

export class VisitorSQLRepository<P extends SQLQueryable>
  implements VisitorRepository<P>
{
  get(id: string, ctx: P): Promise<Result<Option<Visitor>, Error>> {
    // I prefer Promise<Option<T>> but we get some free methods with AsyncOption
    const result = tryAsync(() =>
      ctx
        .query<Visitor>("SELECT ip from visitor WHERE ip = $1", [id])
        .then((result) =>
          result.rows.length == 0
            ? None
            : Some({ ip: result.rows[0].ip } as Visitor),
        ),
    );
    return result;
  }
  async exists(id: string, ctx: P): Promise<Result<boolean, Error>> {
    const result = await tryAsync(() =>
      ctx.query<Visitor>("SELECT ip from visitor WHERE ip = $1", [id]),
    );
    if (result.isErr()) return result;
    return Ok(result.value.rows.length > 0);
  }
  insert(visitor: Visitor, ctx: P): Promise<Result<Visitor, Error>> {
    // I prefer Promise<Option<T>> but we get some free methods with AsyncOption
    const { ip } = visitor;
    const result = tryAsync(() =>
      ctx
        .query("INSERT INTO visitor(ip) VALUES($1)", [ip])
        .then((_result) => visitor),
    );
    return result;
  }
  delete(id: string): Promise<Result<null, Error>> {
    throw new Error("Method not implemented.");
  }
}

export default VisitorRepository;
