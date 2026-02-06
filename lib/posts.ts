import { CommitEntry } from "@/lib/buildInfo";

type MetadataArgs = {
  id: string;
  title: string;
  tags?: string[];
  buildInfo: {
    isDirty: boolean;
    currentCommit: CommitEntry;
    firstCommit: CommitEntry;
  };
  version?: number;
  createdTimestamp?: string;
  modifiedTimestamp?: string;
};

export class Metadata {
  id: string;
  title: string;
  tags: string[];
  createdTimestamp: string;
  modifiedTimestamp: string;
  buildInfo: MetadataArgs["buildInfo"];
  version?: number;

  constructor({
    id,
    title,
    tags = [],
    buildInfo,
    version,
    createdTimestamp,
    modifiedTimestamp,
  }: MetadataArgs) {
    this.id = id;
    this.title = title;
    this.tags = tags;
    this.buildInfo = buildInfo;
    this.version = version;
    this.createdTimestamp =
      createdTimestamp ?? this.buildInfo.firstCommit.timestamp;
    this.modifiedTimestamp =
      modifiedTimestamp ?? this.buildInfo.currentCommit.timestamp;
  }
}
export type Post = {
  metadata: Metadata;
  content: {
    head: string;
    body: string;
  }; // Rendered file contents, most likely as rendered html
};
