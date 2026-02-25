import React, { useMemo, useState } from "react";
import {
  type BuildInfo,
  CommitEntry,
  SerializedBuildInfo,
} from "@/lib/buildInfo";

import { CodeXml, TextIcon, ClockIcon, GitCommit } from "lucide-react";
import Link from "next/link";
import { blogInitialsFont } from "@/lib/fonts";

export function computeGithubURLs(buildInfo: SerializedBuildInfo) {
  return {
    repoURL: `https://github.com/michaelfortunato/personal-website`,
    commitURL: `https://github.com/michaelfortunato/personal-website/commit/${buildInfo.buildCommitEntry.commitHash}`,
    branchURL: `https://github.com/michaelfortunato/personal-website/tree/${buildInfo.branch}`,
  };
}

const BuildStamp: React.FC<{
  serializedBuildInfo: SerializedBuildInfo;
  triggerFadeIn?: boolean;
}> = ({ serializedBuildInfo }) => {
  const { commitURL, branchURL } = useMemo(
    () => computeGithubURLs(serializedBuildInfo),
    [serializedBuildInfo.buildCommitEntry.commitHash],
  );

  return (
    <div className="flex justify-center p-2 pb-4">
      <div className="flex flex-col">
        <div className="flex justify-center gap-1">
          <div>Website last built by</div>
          <div
            className={`inline-block ${blogInitialsFont.className} font-extrabold`}
          >
            mnf
          </div>
          (me) on
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <div className="flex items-center gap-1">
            <div>
              <ClockIcon width="15px" strokeWidth={1} />
            </div>
            <Link href={commitURL}>{serializedBuildInfo.buildTimestamp}</Link>
          </div>
          <div className="flex items-center gap-1">
            <div>
              <TextIcon width="15px" strokeWidth={1} />
            </div>
            <div>
              <Link href={commitURL}>
                {serializedBuildInfo.buildCommitEntry.message}
              </Link>
            </div>
          </div>
          <div className="inline-flex items-center">
            <GitCommit
              className="translate-y-[1px]"
              width="15px"
              strokeWidth={1}
            />
            <Link href={commitURL}>
              {serializedBuildInfo.buildCommitEntry.shortCommitHash}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BuildStamp;
