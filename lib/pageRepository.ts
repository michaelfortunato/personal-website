import { Option, Result } from "ts-results-es";
import { SQLQueryable } from "./persistence";
import Repository from "./repository";
import Page from "./page";

export class PageSQLRepository<P extends SQLQueryable>
  implements Repository<Page, P>
{
  get(id: string, ctx: P): Promise<Result<Option<Page>, Error>> {
    throw new Error("Method not implemented.");
  }
  exists(id: string, ctx: P): Promise<Result<boolean, Error>> {
    throw new Error("Method not implemented.");
  }
  insert(t: Page, ctx: P): Promise<Result<Page, Error>> {
    throw new Error("Method not implemented.");
  }
  delete(id: string, ctx: P): Promise<Result<null, Error>> {
    throw new Error("Method not implemented.");
  }
}

export default PageSQLRepository;
