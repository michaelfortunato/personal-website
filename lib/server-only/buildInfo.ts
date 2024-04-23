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
  // NOTE: We assume our build environment has our git repo
  // and git history configured, which getCommitEntryForFile already assumes.
  // So lets just use the git cli to get the info.
  const branch = launchShellCmd("git branch --show-current")?.toString().trim();
  if (!branch)
    throw "Could not compute build branch using git cli. Are you sure the build environment has git set up?";
  const hash = launchShellCmd(`git log -1 --pretty=format:"%H"`)
    ?.toString()
    .trim();
  if (!hash)
    throw "Could not compute build commit hash using git cli. Are you sure the build environment has git set up?";
  const repo = "personal-website"; // This should never change.

  return {
    repo,
    hash,
    branch,
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
    return undefined;
  }
  return buffer;
}
