import { execSync, execFile } from "child_process";
import { promisify } from "util";
import type { BuildInfo, BuildCommitInfo } from "@/lib/buildInfo";
const execFileAsync = promisify(execFile);

export async function getBuildInfo(): Promise<BuildInfo> {
  return {
    commitInfo: await getBuildCommitInfo(),
    buildTimestamp: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
      timeZone: "America/Chicago"
    }),
  };
}

export function getCommitEntryForFile(filepath: string, head: boolean = true) {
  // Prior style for reference: "%H - %an, %at : %s"
  // Example: "8fd2212f... - Michael Fortunato, 1739958235 : tighten static props typing"
  const commitEntryFormat = "%H%x1f%an%x1f%aI%x1f%s";
  const cmd = !head
    ? `git log --reverse --pretty=format:"${commitEntryFormat}" -- ${filepath} | head -1`
    : `git log -1 --pretty=format:"${commitEntryFormat}" -- ${filepath}`;
  const commitEntry = launchShellCmd(cmd)?.toString().trim();
  if (commitEntry == null) return null;
  const [commitHash, author, authorDateISO, message] = commitEntry.split("\x1f");
  if (!(commitHash && author && authorDateISO && message)) {
    return null;
  }
  const timestamp = new Date(authorDateISO);
  if (Number.isNaN(timestamp.valueOf())) {
    return null;
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

export function isDirty(filepath?: string) {
  const cmd = filepath
    ? `git status --porcelain -- ${filepath}`
    : "git status --porcelain";
  try {
    const out = execSync(cmd, { stdio: "pipe" }).toString().trim();
    return out.length > 0;
  } catch {
    return false;
  }
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

let _gitDir: string | null = null;
export async function getGitDir(): Promise<string> {
  if (_gitDir) return _gitDir;
  const { stdout } = await execFileAsync("git", [
    "rev-parse",
    "--show-toplevel",
  ]);
  _gitDir = stdout.trim();
  return _gitDir;
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
