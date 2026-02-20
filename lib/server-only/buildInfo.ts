import { execSync, execFile } from "child_process";
import { promisify } from "util";
import { BuildInfo, CommitEntry } from "@/lib/buildInfo";
import { fromISODateString, Serialized, toISODateString } from "../utils";
const execFileAsync = promisify(execFile);

export async function getBuildInfo(): Promise<BuildInfo> {
  // NOTE: We assume our build environment has our git repo
  // and git history configured, which getCommitEntryForFile already assumes.
  // So lets just use the git cli to get the info.
  const branch =
    launchShellCmd("git branch --show-current")?.toString().trim() || null;
  if (branch == null) {
    throw "Could not compute branch for the build build, are you sure you set up git";
  }
  const buildCommitEntry = getCommitEntry(null, true);
  if (buildCommitEntry == null) {
    throw "Could not compute commit entry for build, are you sure you set up git";
  }
  const buildTimestamp = new Date();
  return { branch, buildTimestamp, buildCommitEntry };
}

export function getCommitEntry(
  forFilepath: string | null = null,
  head: boolean = true,
): CommitEntry | null {
  // Prior style for reference: "%H - %an, %at : %s"
  // Example: "8fd2212f... - Michael Fortunato, 1739958235 : tighten static props typing"
  const commitEntryFormat = "%H%x1f%an%x1f%aI%x1f%s";
  const cmd = !head
    ? `git log --reverse --pretty=format:"${commitEntryFormat}" ${forFilepath != null ? "-- " + forFilepath : ""} | head -1`
    : `git log -1 --pretty=format:"${commitEntryFormat}" ${forFilepath != null ? "-- " + forFilepath : ""}`;
  const commitEntry = launchShellCmd(cmd)?.toString().trim();
  if (commitEntry == null) return null;
  const [commitHash, author, authorDateISO, message] =
    commitEntry.split("\x1f");
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
