export function computeGithubURLs(commit: BuildCommitInfo) {
  return {
    repoURL: `https://github.com/michaelfortunato/${commit.repo}`,
    commitURL: `https://github.com/michaelfortunato/${commit.repo}/commit/${commit.hash}`,
    branchURL: `https://github.com/michaelfortunato/${commit.repo}/tree/${commit.branch}`,
  };
}

export function computeGithubCommitURL(repoName: string, commitHash: string) {
  return `https://github.com/michaelfortunato/${repoName}/commit/${commitHash}`;
}

export type CommitEntry = {
  commitHash: string;
  readonly shortCommitHash: string;
  author: string;
  timestamp: string;
  message: string;
};

/// Define the expected structure of the Commit information.
export type BuildCommitInfo = {
  repo: string;
  hash: string;
  branch: string;
};

export type BuildInfo = {
  commitInfo: BuildCommitInfo;
  buildTimestamp: string;
};
