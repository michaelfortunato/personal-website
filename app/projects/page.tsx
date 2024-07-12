"use client";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

import { Tile as WebsiteTile } from "./personal-website/tile";
import { Tile as EightBitAdderTile } from "./8-bit-adder/tile";

export default function Page() {
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
            <IconButton
              disabled={selected == numTiles - 1}
              onClick={() => {
                setPage([selected + 1, 1]);
              }}
            >
              <ArrowUpward />
            </IconButton>
          </div>
          <div className="flex-initial">
            <IconButton
              disabled={selected == 0}
              onClick={() => {
                setPage([selected - 1, -1]);
              }}
            >
              <ArrowDownward />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
