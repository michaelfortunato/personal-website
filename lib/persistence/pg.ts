import { Pool as PGPool, PoolClient as PGPoolClient } from "pg";
import {
  Context,
  SQLQueryable,
  QueryArrayConfig,
  QueryArrayResult,
  QueryConfig,
  QueryConfigValues,
  QueryResult,
  QueryResultRow,
  Submittable,
  GetClient,
} from "../persistence";
import { Ok, Result } from "ts-results-es";
import { tryAsync } from "../utils";

const pool = new PGPool({
  // connectionString: process.env.POSTGRES_URL,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
});

class PGPoolClientWrapper implements SQLQueryable, Context {
  private readonly inner: PGPoolClient;

  constructor(inner: PGPoolClient) {
    this.inner = inner;
  }

  async start(): Promise<Result<null, Error>> {
    const result = await tryAsync(() => this.query("COMMIT"));
    if (result.isErr()) {
      return result;
    }
    return Ok(null);
  }

  async commit(): Promise<Result<null, Error>> {
    const result = await tryAsync(() => this.query("COMMIT"));
    if (result.isErr()) {
      return result;
    }
    return Ok(null);
  }

  async rollback(): Promise<Result<null, Error>> {
    const result = await tryAsync(() => this.query("ROLLBACK"));
    if (result.isErr()) {
      return result;
    }
    return Ok(null);
  }
  query<T extends Submittable>(queryStream: T): T;
  query<R extends any[] = any[], I = any[]>(
    queryConfig: QueryArrayConfig<I>,
    values?: QueryConfigValues<I>,
  ): Promise<QueryArrayResult<R>>;
  query<R extends QueryResultRow = any, I = any>(
    queryConfig: QueryConfig<I>,
  ): Promise<QueryResult<R>>;
  query<R extends QueryResultRow = any, I = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: QueryConfigValues<I>,
  ): Promise<QueryResult<R>>;
  query<R extends any[] = any[], I = any[]>(
    queryConfig: QueryArrayConfig<I>,
    callback: (err: Error, result: QueryArrayResult<R>) => void,
  ): void;
  query<R extends QueryResultRow = any, I = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    callback: (err: Error, result: QueryResult<R>) => void,
  ): void;
  query<R extends QueryResultRow = any, I = any[]>(
    queryText: string,
    values: QueryConfigValues<I>,
    callback: (err: Error, result: QueryResult<R>) => void,
  ): void;
  query(queryTextOrConfig: any, valuesOrCallback?: any, callback?: any): any {
    return this.inner.query(queryTextOrConfig, valuesOrCallback, callback);
  }
}

export const getClient: GetClient<PGPoolClientWrapper> = async () => {
  const pgPoolClient = await tryAsync(() => pool.connect());
  if (pgPoolClient.isErr()) {
    return pgPoolClient;
  }
  return Ok(new PGPoolClientWrapper(pgPoolClient.value));
};

export default getClient;
