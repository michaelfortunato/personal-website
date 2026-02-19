import { CommitEntry } from "@/lib/buildInfo";
import {
  fromISODateString,
  Serialized,
  toISODateString,
} from "@/lib/utils";

type MetadataArgs = {
  id: string;
  title: string;
  tags: string[];
  buildInfo: {
    isDirty: boolean;
    currentCommit: CommitEntry;
    firstCommit: CommitEntry;
  };
  createdTimestamp: Date | null;
  modifiedTimestamp: Date | null;
};

export class PostMetadata {
  id: string;
  title: string;
  tags: string[];
  createdTimestamp: Date;
  modifiedTimestamp: Date;
  buildInfo: MetadataArgs["buildInfo"];

  constructor({
    id,
    title,
    tags = [],
    buildInfo,
    createdTimestamp,
    modifiedTimestamp,
  }: MetadataArgs) {
    this.id = id;
    this.title = title;
    this.tags = tags;
    this.buildInfo = buildInfo;
    this.createdTimestamp =
      createdTimestamp ?? this.buildInfo.firstCommit.timestamp;
    this.modifiedTimestamp =
      modifiedTimestamp ?? this.buildInfo.currentCommit.timestamp;
  }
}

export type Post = {
  metadata: PostMetadata;
  content: {
    head: string;
    body: string;
  }; // Rendered file contents, most likely as rendered html
};

export type SerializedPostMetadata = Serialized<PostMetadata>;
export type SerializedPost = Serialized<Post>;

function serializeCommitEntry(entry: CommitEntry): Serialized<CommitEntry> {
  return {
    ...entry,
    timestamp: toISODateString(entry.timestamp),
  };
}

function deserializeCommitEntry(entry: Serialized<CommitEntry>): CommitEntry {
  return {
    ...entry,
    timestamp: fromISODateString(entry.timestamp),
  };
}

export function serializePostMetadata(
  metadata: PostMetadata,
): SerializedPostMetadata {
  return {
    ...metadata,
    createdTimestamp: toISODateString(metadata.createdTimestamp),
    modifiedTimestamp: toISODateString(metadata.modifiedTimestamp),
    buildInfo: {
      ...metadata.buildInfo,
      currentCommit: serializeCommitEntry(metadata.buildInfo.currentCommit),
      firstCommit: serializeCommitEntry(metadata.buildInfo.firstCommit),
    },
  };
}

export function deserializePostMetadata(
  metadata: SerializedPostMetadata,
): PostMetadata {
  return new PostMetadata({
    ...metadata,
    createdTimestamp: fromISODateString(metadata.createdTimestamp),
    modifiedTimestamp: fromISODateString(metadata.modifiedTimestamp),
    buildInfo: {
      ...metadata.buildInfo,
      currentCommit: deserializeCommitEntry(metadata.buildInfo.currentCommit),
      firstCommit: deserializeCommitEntry(metadata.buildInfo.firstCommit),
    },
  });
}

export function serializePost(post: Post): SerializedPost {
  return {
    ...post,
    metadata: serializePostMetadata(post.metadata),
  };
}

export function deserializePost(post: SerializedPost): Post {
  return {
    ...post,
    metadata: deserializePostMetadata(post.metadata),
  };
}
