import { ReactElement, PropsWithChildren, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowDown, ArrowUp, FlipHorizontal } from "lucide-react";

import { Tile as WebsiteTile } from "./personal-website";
import { Tile as EightBitAdderTile } from "./8-bit-adder";
import { NextPageWithLayout } from "pages/_app";
import RootPageLayout from "@/components/RootPageLayout";
import { getBuildInfo } from "@/lib/server-only/buildInfo";
import { Button } from "@/components/ui/button";

export function TileFactory(
  title: string,
  leftHandComponent: ReactElement,
  rightHandComponent: ReactElement,
  link: string,
) {
  const router = useRouter();
  return (
    <StyledTile>
      <div className="flex flex-col gap-5">
        <div className="p2 flex">
          <div className="flex-1">
            <h2 className="p-4 text-5xl">{title}</h2>
          </div>
          <div className="flex flex-1 flex-row-reverse">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={link}
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => {
                    router.push(`/projects/${link}`);
                  }, 350);
                }}
              >
                <FlipHorizontal />
                <span className="sr-only">View full</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 p-4">{leftHandComponent}</div>
          <div className="flex-1">{rightHandComponent}</div>
        </div>
      </div>
    </StyledTile>
  );
}

export function StyledTile({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-96 rounded bg-neutral-50 p-3 shadow-md">
      {children}
    </div>
  );
}

export function Layout(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div className="h-screen bg-neutral-50 p-10">
      <motion.div layoutId="page">
        <div className="flex flex-row-reverse">
          <Link href="/projects">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Link>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const Page: NextPageWithLayout = () => {
  const [[selected, direction], setPage] = useState([0, 0]);
  const tiles = [<WebsiteTile key={1} />, <EightBitAdderTile key={2} />];
  const numTiles = tiles.length;

  const OFFSET = 300;
  const variants = {
    enter: (direction: number) => {
      return {
        y: direction > 0 ? OFFSET : -OFFSET,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        y: direction < 0 ? OFFSET : -OFFSET,
        opacity: 0,
      };
    },
  };
  return (
    <div className="flex overflow-hidden">
      <div className="flex-1" />
      <div className="flex flex-[2] flex-col justify-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={selected}
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {tiles[selected]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex-1">
        <div className="flex h-[100vh] flex-col items-center justify-center">
          <div className="flex-initial">
            <Button
              variant="ghost"
              size="icon"
              disabled={selected == numTiles - 1}
              onClick={() => {
                setPage([selected + 1, 1]);
              }}
            >
              <ArrowUp />
            </Button>
          </div>
          <div className="flex-initial">
            <Button
              variant="ghost"
              size="icon"
              disabled={selected == 0}
              onClick={() => {
                setPage([selected - 1, -1]);
              }}
            >
              <ArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Page.getLayout = (page) => {
  return (
    <RootPageLayout buildInfo={page.props.buildInfo}>{page}</RootPageLayout>
  );
};

export async function getStaticProps() {
  return {
    props: { buildInfo: await getBuildInfo() },
  };
}

export default Page;
