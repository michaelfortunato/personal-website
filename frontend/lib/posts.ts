import { CommitEntry } from "@/lib/buildInfo";

type Tag = "Compiler";

export type FrontMatter = Partial<{
  /// for use by other articles for linking and informs the url of the article
  id: string;
  /// the front matter title
  title: string;
  /// The date when the post was created
  createdTimestamp: string;
  /// The date when the post was last modified
  modifiedTimestamp: string;
  /// What version of the article? This should be manual
  version: number;
  tags: Tag[];
}>;

export type Metadata = Required<FrontMatter> & {
  /// for use by other articles for linking and informs the url of the article
  id: string;
  /// the front matter title
  title: string;
  /// meta information about the build of this article
  buildInfo: {
    /// The git commit that built this article
    currentCommit: CommitEntry;
    /// The first git commit that built this article
    firstCommit: CommitEntry;
  };
};

export function createMetadata(
  id: string,
  title: string,
  frontMatter: FrontMatter,
  currentCommit: CommitEntry,
  firstCommit: CommitEntry,
) {
  return {
    id: frontMatter.id ?? id,
    title: frontMatter.title ?? title,
    createdTimestamp: frontMatter.createdTimestamp ?? firstCommit.timestamp,
    modifiedTimestamp: frontMatter.modifiedTimestamp ?? currentCommit.timestamp,
    version: frontMatter.version ?? 1,
    tags: frontMatter.tags ?? [],
    buildInfo: { currentCommit, firstCommit },
  };
}

export type Post = {
  metadata: Metadata;
  content: string; // Rendered file contents, most likely as rendered html
  [key: string]: any; // TODO: Type correctly
};
