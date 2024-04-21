import React, { useEffect, useMemo, useState } from "react";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import { type BuildInfo, type BuildCommitInfo } from "@/lib/buildInfo";

import { GetStaticProps } from "next";
import {
  BookA,
  CodeXml,
  CornerDownRight,
  Fingerprint,
  Moon,
  Sun,
} from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { NextPageWithLayout } from "./_app";
import RootPageLayout from "@/components/RootPageLayout";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBuildInfo } from "@/lib/server-only/buildInfo";
import { GitHubLogoIcon, FileIcon } from "@radix-ui/react-icons";
import BuildStamp from "@/components/BuildStamp";
import GPGKey from "@/components/GPGKey";
import { Toaster } from "@/components/ui/toaster";

const defaultGridConfig = {
  random: true,
  numLines: 12,
  offset: 0,
  avgDuration: 200,
  avgDelay: 1500,
  isDot: true,
};

type Props = {
  buildInfo: BuildInfo;
};

// Renders home page of a nextjs app (index.tsx)
const Page: NextPageWithLayout<Props> = ({ buildInfo }: Props) => {
  const [triggerNameEnter, setTriggerNameEnter] = useState(false);
  const [triggerGridExit, setTriggerGridExit] = useState(false);
  // NOTE: work around to get tool tip with dialog
  const [isTooltipAllowed, setIsTooltipAllowed] = useState(true);
  return (
    <>
      <AnimatePresence>
        {!triggerGridExit && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ type: "spring", duration: 2 }}
          >
            <Grid
              setTriggerGridExit={setTriggerGridExit}
              setTriggerNameEnter={setTriggerNameEnter}
              {...defaultGridConfig}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute right-0 top-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={triggerGridExit && { opacity: 1 }}
          transition={{ type: "spring", duration: 7 }}
          className="flex gap-2 p-6"
        >
          <div>
            <Dialog onOpenChange={() => setIsTooltipAllowed(false)}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onMouseEnter={() => setIsTooltipAllowed(true)}
                  >
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Fingerprint width={24} height={24} />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  {isTooltipAllowed && (
                    <TooltipContent>
                      <p>Get My gnuPGP Key</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <DialogContent className="max-h-screen bg-card lg:max-w-4xl">
                <GPGKey />
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Link href="/Resume.pdf" target="_blank">
                      <FileIcon width={24} height={24} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View My Resume</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Link
                      href="https://github.com/michaelfortunato"
                      target="_blank"
                    >
                      <GitHubLogoIcon width={24} height={24} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View my code forge</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      </div>
      <Hero triggerNameEnter={triggerNameEnter} />
      <div className="absolute bottom-0 left-0 w-full">
        <BuildStamp buildInfo={buildInfo} triggerFadeIn={triggerGridExit} />
      </div>
    </>
  );
};

Page.getLayout = (page) => {
  return <RootPageLayout>{page}</RootPageLayout>;
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async () => {
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      buildInfo: await getBuildInfo(),
    },
  };
};
export default Page;
