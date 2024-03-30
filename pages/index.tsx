import React, { useEffect, useMemo, useState } from "react";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import { BuildInfo, computeGithubURLs, getBuildInfo } from "lib/buildInfo";
import { GetStaticProps } from "next";
import {
  BookA,
  CodeXml,
  CornerDownRight,
  Moon,
  NotebookText,
  Sun,
} from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { NextPageWithLayout } from "./_app";
import RootPageLayout from "@/components/RootPageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Github from "@/public/github-mark/github-mark.svg";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const BuildInfo: React.FC<{ buildInfo: BuildInfo; triggerFadeIn: boolean }> = ({
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={triggerFadeIn && { opacity: 1 }}
      transition={{ type: "spring", duration: 7 }}
      className="flex justify-center md:justify-normal"
    >
      <div className="min-w-2/12 m-2 rounded border-4 border-dotted border-foreground p-8 pt-4 md:min-w-[25%]">
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

export type ModeToggleProps = React.ButtonHTMLAttributes<ButtonProps> & {};

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  console.log(theme);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => (theme == "light" ? setTheme("dark") : setTheme("light"))}
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

// Renders home page of a nextjs app (index.tsx)
const Page: NextPageWithLayout<Props> = ({ buildInfo }: Props) => {
  const [triggerNameEnter, setTriggerNameEnter] = useState(false);
  const [triggerGridExit, setTriggerGridExit] = useState(false);
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
        {/* <ModeToggle /> */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={triggerGridExit && { opacity: 1 }}
          transition={{ type: "spring", duration: 7 }}
          className="flex gap-8 p-6"
        >
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Link href="/Resume.pdf" target="_blank">
                      <BookA />
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
                      <Image src={Github} alt="Social source forge link" />
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
        <BuildInfo buildInfo={buildInfo} triggerFadeIn={triggerGridExit} />
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
