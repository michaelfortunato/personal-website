import { exit } from "process";
import { SQLQueryable, getPGClient as getClient } from "../lib/persistence";

async function sqlSeedVisitors<P extends SQLQueryable>(db: P) {
  const insertRow = `
    INSERT INTO visitor (ip)
    VALUES ($1)
    ON CONFLICT DO NOTHING;
  `;
  await db.query(insertRow, ["10.0.0.10"]);
}

const seedVisitors = sqlSeedVisitors;

async function sqlSeedPages<P extends SQLQueryable>(db: P) {
  const insertRow = `
    INSERT INTO page (url, created_at, modified_at)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING;
  `;
  const nowSeconds = new Date();
  await db.query(insertRow, ["/", nowSeconds, nowSeconds]);
  await db.query(insertRow, ["/about", nowSeconds, nowSeconds]);
  await db.query(insertRow, ["/blog", nowSeconds, nowSeconds]);
  await db.query(insertRow, [
    "/blog/mcc-and-fabrice-ballard",
    nowSeconds,
    nowSeconds,
  ]);
}

const seedPages = sqlSeedPages;

async function sqlSeedUsers<P extends SQLQueryable>(db: P) {
  const insertRow = `
    INSERT INTO "user" (username, email)
    VALUES ($1, $2);
  `;
  await db.query(insertRow, ["admin", "admin@gmail.com"]);
}
const seedUsers = sqlSeedUsers;

async function main() {
  try {
    const client = (await getClient()).unwrap();
    await seedUsers(client);
  } catch (e) {
    console.error(e);
    exit(1);
  }
  exit(0);
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
