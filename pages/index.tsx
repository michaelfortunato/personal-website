import React, { useState } from "react";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import { type BuildInfo, type BuildCommitInfo } from "@/lib/buildInfo";

import { GetStaticProps } from "next";
import { Fingerprint } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { NextPageWithLayout } from "./_app";
import RootPageLayout from "@/components/RootPageLayout";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBuildInfo } from "@/lib/server-only/buildInfo";
import { FileIcon } from "@radix-ui/react-icons";
import GPGKey from "@/components/GPGKey";

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
              <DialogPortal>
                <DialogOverlay>
                  <div className="absolute bottom-0 flex w-full justify-center">
                    <Button>Close</Button>
                  </div>
                </DialogOverlay>
                <DialogContent className="w-fit max-w-full p-0">
                  <div className="max-h-[80vh]">
                    <GPGKey />
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" asChild>
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
                  <Button size="icon" variant="ghost" asChild>
                    <Link
                      href="https://github.com/michaelfortunato"
                      target="_blank"
                      className="group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 92 92"
                      >
                        <defs>
                          <clipPath id="a">
                            <path d="M0 .113h91.887V92H0zm0 0"></path>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#a)">
                          <path
                            fill="#100f0d"
                            className="group-hover:fill-white"
                            d="M90.156 41.965L50.036 1.848a5.913 5.913 0 00-8.368 0l-8.332 8.332 10.566 10.566a7.03 7.03 0 017.23 1.684 7.043 7.043 0 011.673 7.277l10.183 10.184a7.026 7.026 0 017.278 1.672 7.04 7.04 0 010 9.957 7.045 7.045 0 01-9.961 0 7.038 7.038 0 01-1.532-7.66l-9.5-9.497V59.36a7.04 7.04 0 011.86 11.29 7.04 7.04 0 01-9.957 0 7.04 7.04 0 010-9.958 7.034 7.034 0 012.308-1.539V33.926a7.001 7.001 0 01-2.308-1.535 7.049 7.049 0 01-1.516-7.7L29.242 14.273 1.734 41.777a5.918 5.918 0 000 8.371L41.855 90.27a5.92 5.92 0 008.368 0l39.933-39.934a5.925 5.925 0 000-8.371"
                          ></path>
                        </g>
                      </svg>
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
    </>
  );
};

Page.getLayout = (page) => {
  return (
    <RootPageLayout buildInfo={page.props.buildInfo}>{page}</RootPageLayout>
  );
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
