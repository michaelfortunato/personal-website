import { CommitEntry } from "@/lib/buildInfo";

export type Metadata = {
  /// for use by other articles for linking and informs the url of the article
  id: string;
  /// the front matter title
  title: string;

  version?: number;

  tags: string[];

  /// meta information about the build of this article
  buildInfo: {
    isDirty: boolean;
    /// The git commit that built this article
    currentCommit: CommitEntry;
    /// The first git commit that built this article
    firstCommit: CommitEntry;
  };
};

export function createMetadata(
  id: string,
  title: string,
  currentCommit: CommitEntry,
  firstCommit: CommitEntry,
  tags: string[] = [],
  isDirty: boolean = false,
) {
  return {
    id: id,
    title: title,
    createdTimestamp: firstCommit.timestamp,
    modifiedTimestamp: currentCommit.timestamp,
    tags: tags ?? [],
    buildInfo: { isDirty, currentCommit, firstCommit },
  };
}

export type Post = {
  metadata: Metadata;
  content: string; // Rendered file contents, most likely as rendered html
  [key: string]: any; // TODO: Type correctly
};
