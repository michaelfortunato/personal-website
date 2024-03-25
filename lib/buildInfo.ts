function assertEnvVarExists(
	value: unknown,
	variableName: string
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

export function computeGithubURLs(commit: Commit) {
	return {
		repoURL: `https://github.com/michaelfortunato/${commit.repo}`,
		commitURL: `https://github.com/michaelfortunato/${commit.repo}/commit/${commit.hash}`,
		branchURL: `https://github.com/tree/${commit.branch}`
	};
}

export function computeGithubCommitURL(repo: string, hash: string) {
	return `https://github.com/michaelfortunato/${repo}/commit/${hash}`;
}

export function computeGithubRepoURL(repo: string) {
	return `https://github.com/michaelfortunato/${repo}`;
}

export function computeGithubBranchURL(repo: string, branch: string) {
	return `https://github.com/michaelfortunato/${repo}/tree/${branch}`;
}

// Define the expected structure of the Commit information.
export type Commit = {
	repo: string;
	hash: string;
	branch: string;
};

/** Returns the commit info for this build
 *
 * @returns {Promise<Commit>}
 */
export async function getCommitInfo(): Promise<Commit> {
	// NOTE: These environment variables are prepoluated in next.config.js
	// Assert each required environment variable is a non-empty string.
	assertEnvVarExists(process.env.GIT_REPO_NAME, "GIT_REPO_NAME");
	assertEnvVarExists(process.env.GIT_COMMIT_SHA, "GIT_COMMIT_SHA");
	assertEnvVarExists(process.env.GIT_COMMIT_BRANCH, "GIT_COMMIT_BRANCH");

	return {
		repo: process.env.GIT_REPO_NAME,
		hash: process.env.GIT_COMMIT_SHA,
		branch: process.env.GIT_COMMIT_BRANCH
	};
}

export type BuildInfo = {
	commitInfo: Commit;
	buildTimestamp: string;
};

export async function getBuildInfo(): Promise<BuildInfo> {
	return {
		commitInfo: await getCommitInfo(),
		buildTimestamp: new Date().toISOString()
	};
}
