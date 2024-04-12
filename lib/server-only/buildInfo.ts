import { execSync } from "child_process";
import type { BuildInfo, BuildCommitInfo } from "@/lib/buildInfo";

export async function getBuildInfo(): Promise<BuildInfo> {
  return {
    commitInfo: await getBuildCommitInfo(),
    buildTimestamp: new Date().toISOString(),
  };
}

export function getCommitEntryForFile(filepath: string, head: boolean = true) {
  const commitEntryPattern = /^([a-f0-9]+) - ([^,]+), ([^:]+) : (.+)$/;
  const cmd = !head
    ? `git log --reverse --pretty=format:"%H - %an, %at : %s" -- ${filepath} | head -1`
    : `git log -1 --pretty=format:"%H - %an, %at : %s" -- ${filepath}`;
  const commitEntry = launchShellCmd(cmd)?.toString().trim();
  if (commitEntry == undefined) return undefined;
  const [, commitHash, author, timestamp, message] =
    commitEntry.match(commitEntryPattern) || [];
  if (!(commitHash && author && timestamp && message)) {
    return undefined;
  }
  return {
    commitHash,
    get shortCommitHash() {
      return this.commitHash.slice(0, 7);
    },
    author,
    timestamp,
    message,
  };
}

/// Returns the commit info for this build
async function getBuildCommitInfo(): Promise<BuildCommitInfo> {
  // NOTE: These environment variables are prepoluated in next.config.js
  // Assert each required environment variable is a non-empty string.
  assertEnvVarExists(process.env.GIT_REPO_NAME, "GIT_REPO_NAME");
  assertEnvVarExists(process.env.GIT_COMMIT_SHA, "GIT_COMMIT_SHA");
  assertEnvVarExists(process.env.GIT_COMMIT_BRANCH, "GIT_COMMIT_BRANCH");

  return {
    repo: process.env.GIT_REPO_NAME,
    hash: process.env.GIT_COMMIT_SHA,
    branch: process.env.GIT_COMMIT_BRANCH,
  };
}

function launchShellCmd(cmd: string) {
  let buffer = undefined;
  try {
    buffer = execSync(cmd, { stdio: "pipe" });
    // @ts-ignore
    if (buffer == "") {
      buffer = undefined;
    }
  } catch (error) {
    console.log(error);
    return buffer;
  }
  return buffer;
}

function assertEnvVarExists(
  value: unknown,
  variableName: string,
): asserts value is string {
  if (
    value == "" ||
    typeof value !== "string" ||
    value === null ||
    value === undefined
  ) {
    throw new Error(`Environment variable "${variableName}" is not a string.`);
  }
}
