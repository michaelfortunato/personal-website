import { None, Option, Result, Some } from "ts-results-es";
import { SQLQueryable } from "./persistence";
import Repository from "./repository";
import Visitor from "./visitor";
import { tryAsync } from "./utils";

export class VisitorSQLRepository<P extends SQLQueryable>
  implements Repository<Visitor, P>
{
  get(id: string, db: P): Promise<Result<Option<Visitor>, Error>> {
    // I prefer Promise<Option<T>> but we get some free methods with AsyncOption
    const result = tryAsync(() =>
      db
        .query<Visitor>("SELECT ip from visitor WHERE ip = $1", [id])
        .then((result) =>
          result.rows.length == 0
            ? None
            : Some({ ip: result.rows[0].ip } as Visitor),
        ),
    );
    return result;
  }
  exists(id: string, db: P): Promise<Result<boolean, Error>> {
    const result = tryAsync(() =>
      db
        .query<Visitor>("SELECT ip from visitor WHERE ip = $1", [id])
        .then((result) => result.rows.length > 0),
    );
    return result;
  }
  insert(visitor: Visitor, db: P): Promise<Result<Visitor, Error>> {
    // I prefer Promise<Option<T>> but we get some free methods with AsyncOption
    const { ip } = visitor;
    const result = tryAsync(() =>
      db
        .query("INSERT INTO visitor(ip) VALUES($1)", [ip])
        .then((_result) => visitor),
    );
    return result;
  }
  delete(id: string): Promise<Result<null, Error>> {
    throw new Error("Method not implemented.");
  }
}

export default VisitorSQLRepository;
