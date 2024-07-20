import { readFileSync, readSync } from "fs";
import { SQLQueryable, getPGClient as getClient } from "../../lib/persistence";
import { tryAsync } from "../../lib/utils";
import { globSync } from "glob";
import { Ok, Result } from "ts-results-es";
import { exit } from "process";

async function main() {
  try {
    // In argv, search for the first occurence of "UP" or "DOWN"
    const option = (
      process.argv.find(
        (value) => value.toLowerCase() == "up" || value.toLowerCase() == "down",
      ) || "up"
    ).toLowerCase();
    console.log(option);
    if (option == "down") {
      await down();
    } else {
      await up();
    }
    exit(0);
  } catch (e) {
    console.error(e);
    exit(1);
  }
}

async function up() {
  const files = globSync("./**/up.sql").reverse();
  const client = (await getClient()).unwrap();
  for (const file of files) {
    const commands = readFileSync(file, { encoding: "utf-8" });
    (await runCommand(client, commands)).unwrap();
  }
}

async function down() {
  const files = globSync("./**/down.sql");
  const client = (await getClient()).unwrap();
  for (const file of files) {
    const commands = readFileSync(file, { encoding: "utf-8" });
    (await runCommand(client, commands)).unwrap();
  }
}

async function runCommand<P extends SQLQueryable>(
  sqlClient: P,
  sqlCommand: string,
  version?: string,
): Promise<Result<null, Error>> {
  const rc = await tryAsync(() => sqlClient.query(sqlCommand));
  if (rc.isErr()) {
    return rc;
  }
  return Ok(null);
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
