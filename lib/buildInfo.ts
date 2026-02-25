import {
  fromISODateString,
  ISODateString,
  Serialized,
  toISODateString,
} from "./utils";

export function computeGithubURLs(buildInfo: BuildInfo) {
  return {
    repoURL: `https://github.com/michaelfortunato/personal-website`,
    commitURL: `https://github.com/michaelfortunato/personal-website/commit/${buildInfo.buildCommitEntry.commitHash}`,
    branchURL: `https://github.com/michaelfortunato/personal-website/tree/${buildInfo.branch}`,
  };
}

export function computeGithubCommitURL(repoName: string, commitHash: string) {
  return `https://github.com/michaelfortunato/${repoName}/commit/${commitHash}`;
}

export function dateToPrettyString(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
    timeZone: "America/Chicago",
  });
}

export type CommitEntry = {
  commitHash: string;
  readonly shortCommitHash: string;
  author: string;
  timestamp: Date;
  message: string;
};

export type SerializedCommitEntry = Serialized<CommitEntry>;

export function serializeCommitEntry(
  entry: CommitEntry,
): SerializedCommitEntry {
  return {
    ...entry,
    timestamp: toISODateString(entry.timestamp),
  };
}

export function deserializeCommitEntry(
  entry: SerializedCommitEntry,
): CommitEntry {
  return {
    ...entry,
    timestamp: fromISODateString(entry.timestamp),
  };
}

/// Define the expected structure of the Commit information.
///@deprecated use CommitEntry instead
export type BuildInfo = {
  branch: string;
  buildTimestamp: Date;
  buildCommitEntry: CommitEntry;
};

export type SerializedBuildInfo = {
  branch: string;
  buildTimestamp: string | ISODateString;
  buildCommitEntry: SerializedCommitEntry;
};

export function serializeBuildInfo(buildInfo: BuildInfo): SerializedBuildInfo {
  return {
    ...buildInfo,
    buildCommitEntry: {
      ...buildInfo.buildCommitEntry,
      timestamp: toISODateString(buildInfo.buildCommitEntry.timestamp),
    },
    buildTimestamp: dateToPrettyString(buildInfo.buildTimestamp),
  };
}
