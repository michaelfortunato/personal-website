import React, { useMemo, useState } from "react";
import { type BuildInfo, type BuildCommitInfo } from "@/lib/buildInfo";

import { CodeXml, DatabaseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClockIcon, CommitIcon } from "@radix-ui/react-icons";
import { blogInitialsFont } from "@/lib/fonts";

export function computeGithubURLs(commit: BuildCommitInfo) {
  return {
    repoURL: `https://github.com/michaelfortunato/${commit.repo}`,
    commitURL: `https://github.com/michaelfortunato/${commit.repo}/commit/${commit.hash}`,
    branchURL: `https://github.com/michaelfortunato/${commit.repo}/tree/${commit.branch}`,
  };
}

const BuildStamp: React.FC<{
  buildInfo: BuildInfo;
  triggerFadeIn?: boolean;
}> = ({
  buildInfo: {
    commitInfo: { repo, hash, branch },
    buildTimestamp,
  },
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { commitURL, branchURL } = useMemo(
    () => computeGithubURLs({ repo, hash, branch }),
    [repo, hash, branch],
  );
  if (!isOpen) {
    return (
      <Button className="z-10" onClick={() => setIsOpen(true)}>
        <CodeXml className="z-10" />
      </Button>
    );
  }
  return (
    <div className="flex justify-center p-2 pb-4">
      <div className="flex flex-col">
        <div className="flex justify-center gap-1">
          <div>Website last built by me, </div>
          <div
            className={`inline-block ${blogInitialsFont.className} font-extrabold`}
          >
            mnf,
          </div>
          on
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <div className="flex items-center gap-1">
            <div>
              <ClockIcon stroke="20px" />
            </div>
            <Link href={commitURL}>{buildTimestamp}</Link>
          </div>
          <div className="flex items-center gap-1">
            <div>
              <DatabaseIcon width="15px" />
            </div>
            <div>
              <Link href={branchURL}>
                {repo}/{branch}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div>
              <CommitIcon stroke="20px" />
            </div>
            <div>
              <Link href={commitURL}>{hash}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BuildStamp;
