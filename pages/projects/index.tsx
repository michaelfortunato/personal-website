/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, {
  ReactElement,
  PropsWithChildren,
  useState,
  useRef,
  useEffect
} from "react";
import Tile from "@components/Projects/Tile";
import { css } from "@emotion/react";
import {
  Backdrop,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography
} from "@mui/material";
import Image from "next/image";
import clayiPhone from "@public/projects/clay-iphone.svg";
import clayMBP from "@public/projects/clay-mbp.svg";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import FlipIcon from "@mui/icons-material/Flip";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowDownward,
  ArrowUpward,
  PreviewOutlined
} from "@mui/icons-material";
import { useWheel } from "@use-gesture/react";

function TileFactory(
  leftHandComponent: ReactElement,
  rightHandComponent: ReactElement
) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <motion.div style={{ perspective: "40rem" }}>
      <motion.div
        style={{
          top: 0,
          left: 0
        }}
        layoutId="page"
        initial={false}
        animate={isOpen ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Paper sx={{ borderRadius: 2, padding: 3, boxShadow: 3 }}>
          <motion.div
            initial={false}
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          >
            <Grid container>
              <Grid container item xs={12} justifyContent={"right"}>
                <Grid item xs="auto">
                  <Link
                    href={"personal-website"}
                    onClick={e => {
                      setIsOpen(!isOpen);
                      e.preventDefault();
                      setTimeout(() => {
                        router.push("/projects/personal-website");
                      }, 350);
                    }}
                  >
                    <IconButton aria-label="View full">
                      <FlipIcon />
                    </IconButton>
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                {leftHandComponent}
              </Grid>
              <Grid container item xs={6} alignItems={"center"}>
                {rightHandComponent}
              </Grid>
            </Grid>
          </motion.div>
        </Paper>
      </motion.div>
    </motion.div>
  );
}

function TileFactory2(
  leftHandComponent: ReactElement,
  rightHandComponent: ReactElement
) {
  return (
    <Paper className="p-4">
      <div className="flex justify-end">
        <div className="flex-initial">
          <Link href={"projects/personal-website"}>
            <IconButton aria-label="View full">
              <FlipIcon />
            </IconButton>
          </Link>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">{leftHandComponent}</div>
        <div className="flex-1">{rightHandComponent}</div>
      </div>
    </Paper>
  );
}

function WebsiteTile() {
  const leftHandSize = () => (
    <Box sx={{ paddingLeft: 4 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h2">Personal Website</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            This website is a public vault of my life, and there is heavy emphasis on intricate animations.
            It was built using NextJS. 10/18: I need a cool looking about section...
            The NYC train animation is good and I did have a timeline extending out of it using GSAP
            that I kinda liked but I should go back into Adobe Affect Effects and make something nicer looking.
            This is all too late for grad school apps. Too bad! TODO: I think what I should do is create a work in progress
            sign on the page just for presentation sake and get the blog set up. That should take about an evening.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
  const rightHandside = () => (
    <div className="flex">
      <div className="flex-initial">
        <Image src={clayiPhone} alt="clay-iphone.svgb" />
      </div>
      <div className="flex-initial">
        <Image src={clayMBP} alt="clay-mbp.svgb" />
      </div>
    </div>
  );
  return TileFactory(leftHandSize(), rightHandside());
}

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ height: "100vh", paddingLeft: 20, paddingRight: 20 }}
    >
      <Grid item xs={12}>
        <Paper component={motion.div} layoutId="page" sx={{ padding: 10 }}>
          {children}
        </Paper>
      </Grid>
    </Grid>
  );
}
// https://codesandbox.io/s/charming-smoke-6smztk?file=/src/CarouselContents.jsx:1684-1692

function Tile2(offset: number, prevOffset: number, base: number) {
  if (prevOffset + base == 1 && offset + base == 0) {
    <motion.div className="absolute" key={base}>
      <div
        css={css`
					top: -50vh;
					transform: translateY(-50%);
				`}
      >
        <WebsiteTile />
      </div>
    </motion.div>;
  } else if (prevOffset + base == 0 && offset + base == 1) {
    <motion.div className="absolute" key={base}>
      <div
        css={css`
					top: 150vh;
					transform: translateY(-50%);
				`}
      >
        <WebsiteTile />
      </div>
    </motion.div>;
  } else {
    return (
      <motion.div
        className="absolute"
        key={base}
        animate={{ y: `${(offset + base) * 50 - 50}vh` }}
      >
        <div
          css={css`
						transform: translateY(-50%);
					`}
        >
          <WebsiteTile />
        </div>
      </motion.div>
    );
  }
}

const START_selected = 0
const END_selected = 4

function calculateWindow(index: number, length: number) {
  if (index == 0) {
    return {
      "top": (length - 1),
      "center": 0,
      "bottom": 1,
    }
  } else if (index == length - 1) {
    return {
      "top": index - 1,
      "center": index,
      "right": 1,
    }
  }
  return {
    "top": index - 1,
    "center": index,
    "right": index + 1,
  }
}

// Direction is indicated by sign
function calculateDistance(x2: number, x1: number, length: number) {
  return Math.abs(x2 - x1) % length
}

export default function Projects() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex overflow-hidden" >
      <div>

      </div>
      <div className="flex-1" />
      <div className="flex-initial flex flex-col justify-center">
        <motion.div className="container" key={selected}
          animate={{ opacity: 1 }}
        >
          <WebsiteTile />
        </motion.div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col justify-center items-center h-[100vh]">
          <div className="flex-initial">
            <IconButton
              onClick={() => setSelected(selected - 1)}>
              <ArrowUpward />
            </IconButton>
          </div>
          <div className="flex-initial">
            <IconButton
              onClick={() => setSelected(selected + 1)}>
              <ArrowDownward />
            </IconButton>
          </div>
        </div>
      </div>
    </div >
  );
}
