import { SQLQueryable, getPGClient as getClient } from "../lib/persistence";

async function sqlSeedPageVisits<P extends SQLQueryable>(db: P) {
  const createPageVisitTable = `
  CREATE TABLE IF NOT EXISTS page_visit (
  page_url VARCHAR(100),
  visitor_ip inet,
  visited_at TIMESTAMP,
  reaction integer,
  PRIMARY KEY (page_url, visitor_ip));
`;
  await db.query(createPageVisitTable);
}

const seedPageVisits = sqlSeedPageVisits;

async function sqlSeedPages<P extends SQLQueryable>(db: P) {
  const createPageVisitTable = `
  CREATE TABLE IF NOT EXISTS page (
  page_url VARCHAR(100),
  created_at TIMESTAMP,
  modified_at TIMESTAMP,
  PRIMARY KEY page_url
  );
`;
  await db.query(createPageVisitTable);
}

const seedPages = sqlSeedPages;

async function main() {
  console.log(process.env);
  const client = (await getClient()).unwrap();
  await seedPageVisits(client);
  await seedPages(client);
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
