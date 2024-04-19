import React, { useMemo, useState } from "react";
import { type BuildInfo, type BuildCommitInfo } from "@/lib/buildInfo";

import {
  BadgeCheckIcon,
  CodeXml,
  CornerDownRight,
  DatabaseIcon,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClockIcon, CommitIcon, SquareIcon } from "@radix-ui/react-icons";

export function computeGithubURLs(commit: BuildCommitInfo) {
  return {
    repoURL: `https://github.com/michaelfortunato/${commit.repo}`,
    commitURL: `https://github.com/michaelfortunato/${commit.repo}/commit/${commit.hash}`,
    branchURL: `https://github.com/michaelfortunato/${commit.repo}/tree/${commit.branch}`,
  };
}

const BuildStamp: React.FC<{
  buildInfo: BuildInfo;
  triggerFadeIn: boolean;
}> = ({
  buildInfo: {
    commitInfo: { repo, hash, branch },
    buildTimestamp,
  },
  triggerFadeIn,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { repoURL, commitURL, branchURL } = useMemo(
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
    <div className="flex justify-center p-2">
      <div>
        <div className="flex justify-center gap-1">
          <div>
            Last built by <b>me</b>
          </div>
          <BadgeCheckIcon width="15px" />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div>
              <ClockIcon stroke="20px" />
            </div>
            <div>{buildTimestamp}</div>
          </div>
          <div className="flex items-center gap-1">
            <div>
              <DatabaseIcon width="15px" />
            </div>
            <div>
              {repo}/{branch}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div>
              <CommitIcon stroke="20px" />
            </div>
            <div>{hash}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Card>
        <CardHeader>
          <CardTitle>Build Information</CardTitle>
          <CardDescription>Information about this deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Timestamp: {buildTimestamp}</p>
          <p>Repository: {repo}</p>
          <p>Commit Hash: {hash}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div
      // initial={{ opacity: 0 }}
      // animate={triggerFadeIn && { opacity: 1 }}
      // transition={{ type: "spring", duration: 7 }}
      className="flex justify-center md:justify-normal"
    >
      <div className="min-w-2/12 m-2 rounded border border-4 border-foreground p-8 pt-4 md:min-w-[25%]">
        <h2 className="text-center font-buildManifestHeading text-4xl">
          Build Info
        </h2>
        <Separator className="my-2 bg-foreground" />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-x-6 font-medium">
            <div className="uppercase italic">Commit Hash:</div>
            <div>
              <Link href={commitURL} target="_blank">
                {hash}
              </Link>
              <motion.div
                style={{ transformOrigin: "50%" }}
                initial={{ scaleX: 0 }}
                animate={
                  triggerFadeIn && {
                    scaleX: 0.1,
                  }
                }
                transition={{ delay: 2 }}
              >
                <hr className="border-foreground" />
              </motion.div>
            </div>
          </div>
          <div className="flex justify-between gap-x-6 font-medium">
            <div className="uppercase italic">Branch:</div>
            <div>
              <Link href={branchURL} target="_blank">
                {branch}
              </Link>
              <motion.div
                style={{ transformOrigin: "50%" }}
                initial={{ scaleX: 0 }}
                animate={
                  triggerFadeIn && {
                    scaleX: 0.1,
                  }
                }
                transition={{ delay: 2 }}
              >
                <hr className="border-foreground" />
              </motion.div>
            </div>
          </div>
          <div className="flex justify-between gap-x-6 font-medium">
            <div className="uppercase italic">Repo:</div>
            <div>
              <Link href={repoURL} target="_blank">
                {repo}
              </Link>
              <motion.div
                style={{ transformOrigin: "50%" }}
                initial={{ scaleX: 0 }}
                animate={
                  triggerFadeIn && {
                    scaleX: 0.1,
                  }
                }
                transition={{ delay: 2 }}
              >
                <hr className="border-foreground" />
              </motion.div>
            </div>
          </div>
          <div className="flex justify-between gap-x-6 font-medium">
            <div className="uppercase italic">Build Timestamp:</div>
          </div>
          <div className="flex justify-between font-medium">
            <CornerDownRight strokeWidth={1.5} />
            <div>{buildTimestamp}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default BuildStamp;
