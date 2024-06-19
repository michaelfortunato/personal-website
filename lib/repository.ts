import { Ok, Err, Result, Option, AsyncResult } from "ts-results-es";
import { SQLQueryable } from "./persistence";

export default interface Repository<T, P> {
  get(id: string, ctx: P): Promise<Result<Option<T>, Error>>;
  exists(id: string, ctx: P): Promise<Result<boolean, Error>>;
  insert(t: T, ctx: P): Promise<Result<T, Error>>;
  delete(id: string, ctx: P): Promise<Result<null, Error>>;
}
