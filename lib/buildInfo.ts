export function computeGithubURLs(commit: BuildCommitInfo) {
  return {
    repoURL: `https://github.com/michaelfortunato/${commit.repo}`,
    commitURL: `https://github.com/michaelfortunato/${commit.repo}/commit/${commit.hash}`,
    branchURL: `https://github.com/michaelfortunato/${commit.repo}/tree/${commit.branch}`,
  };
}

export type CommitEntry = {
  commitHash: string;
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
