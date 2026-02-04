import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content", "typst");
const outputRoot = path.join(repoRoot, "public", "typst");

const [maybeId] = process.argv.slice(2);

const versionCheck = spawnSync("rheo", ["--version"], { stdio: "ignore" });
if (versionCheck.status !== 0) {
  fail(
    [
      "Missing `rheo` in PATH.",
      "Install it with:",
      "  cargo install --locked rheo",
      "",
      "Docs: https://rheo.ohrg.org",
    ].join("\n"),
  );
}

if (!fs.existsSync(contentRoot)) {
  fail(`Missing Typst content directory: ${contentRoot}`);
}

const projectIds = maybeId
  ? [maybeId]
  : fs
      .readdirSync(contentRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

if (projectIds.length === 0) {
  console.log("No Typst projects found to build.");
  process.exit(0);
}

fs.mkdirSync(outputRoot, { recursive: true });

for (const id of projectIds) {
  const projectDir = path.join(contentRoot, id);
  const metaPath = path.join(projectDir, "meta.json");
  if (!fs.existsSync(metaPath)) {
    console.warn(`Skipping ${id}: missing ${metaPath}`);
    continue;
  }

  const buildDir = path.join(outputRoot, id);
  fs.mkdirSync(buildDir, { recursive: true });

  console.log(`Building Typst project: ${id}`);
  const result = spawnSync(
    "rheo",
    ["compile", projectDir, "--html", "--build-dir", buildDir],
    {
      stdio: "inherit",
    },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  const expectedIndexHtml = path.join(buildDir, "html", "index.html");
  if (!fs.existsSync(expectedIndexHtml)) {
    console.warn(
      `Warning: expected ${expectedIndexHtml} but it was not found.`,
    );
  }
}
