/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { useResizeDetector } from "react-resize-detector";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import { useInView } from "react-intersection-observer";
import Tooltip from "@mui/material/Tooltip";
import {
  MainContentBoxes,
  FLContentBoxes,
  NLContentBoxes,
  NRContentBoxes,
  FRContentBoxes,
} from "./About2Config";
import ContentBoxMachine from "./ContentBoxMachine";

gsap.registerPlugin(MotionPathPlugin);
const ListOfContentBoxes = [
  MainContentBoxes,
  FLContentBoxes,
  NLContentBoxes,
  NRContentBoxes,
  FRContentBoxes,
];
const StyledPage = styled(motion.div)`
  overflow: hidden;
  height: 400vh;
  width: 100vw;
  position: relative;
`;
const StyledLine = styled.path`
  fill: none;
  stroke: ${(props) => props.color};
  stroke-width: 34;
  stroke-linejoin: round;
  stroke-dasharray: 3100;
  stroke-dashoffset: 3100;
`;

const StyledTimelineIntro = styled.div`
  position: absolute;
  top: 20vh;
  left: 60%;
  color: white;
  display: block;
  opacity: 0;
`;
const TimelineIntro = (props) => {
  const [animationIsDone, setAnimationIsDone] = useState(false);
  const timeline = useRef(null);
  useEffect(() => {
    const query = gsap.utils.selector(document.body);
    const introElements = query(".tlIntro");
    timeline.current = gsap.timeline({
      onComplete: () => {
        setAnimationIsDone(true);
      },
    });
    const stayTimes = [1.24, 1.24, 2];
    const leaveAnimation = {};
    introElements.forEach((elem, index) => {
      let leaveAnimation = {};
      if (index === introElements.length - 1) {
        leaveAnimation = { opacity: 0, duration: 0.4 };
      } else {
        leaveAnimation = { opacity: 0, duration: 0.4 };
      }

      timeline.current
        .fromTo(
          elem,
          { transform: "translateY(-10vh)" },
          {
            transform: `translateY(0)`,
            opacity: 1,
            duration: 0.4,
          },
          `${index !== 0 ? ">0.2" : "<0.2"}`,
        )
        .to(elem, leaveAnimation, `>${stayTimes[index]}`);
    });
  }, []);
  return (
    !animationIsDone && (
      <>
        <StyledTimelineIntro className="tlIntro">
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h4">
                This is a timeline of my life.
              </Typography>
            </Grid>
          </Grid>
        </StyledTimelineIntro>
        <StyledTimelineIntro className="tlIntro">
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h4">
                Red for the 1 train (the best train).
              </Typography>
            </Grid>
          </Grid>
        </StyledTimelineIntro>
        <StyledTimelineIntro className="tlIntro">
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h4">
                Click on the subway stops to learn about me.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">Thanks for visiting!</Typography>
            </Grid>
          </Grid>
        </StyledTimelineIntro>
      </>
    )
  );
};
const scaleFactor = 1;
const VIEWBOX_WIDTH = scaleFactor * 3658.6;
const VIEWBOX_HEIGHT = scaleFactor * 6486.5;
const VIEWBOX_SHIFT_X =
  scaleFactor !== 1 ? VIEWBOX_WIDTH / (scaleFactor * 2 * 2) : 0;

const ToolTip = (props) => (
  <AnimatePresence>
    {props.tooltipConfig && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1.1 }}
        exit={{ opacity: 0, scale: 0 }}
        style={{
          zIndex: 0,
          position: "absolute",
          left: props.tooltipConfig.x,
          top: props.tooltipConfig.y,
        }}
      >
        <Typography style={{ color: "white" }} variant="body1">
          {props.tooltipConfig.description}
        </Typography>
      </motion.div>
    )}
  </AnimatePresence>
);

const BulidTimeline = (lineId, circleQuery, circleClass, options) => {
  let timeline = null;
  const circles = circleQuery(circleClass);
  if (circleClass !== ".Main-Circle") circles.reverse();
  const line = document.getElementById(lineId);
  if (line !== null && circles.length !== 0) {
    const lineLength = line.getTotalLength();
    gsap.set(line, {
      strokeDasharray: lineLength,
      strokeDashoffset: lineLength,
    });
    timeline = gsap
      .timeline({ paused: options.paused })
      .to(line, options.lineAni)
      .fromTo(
        circles,
        { scale: 0, opacity: 0 },
        {
          scale: 1.3,
          opacity: 1,
          stagger: 0.4,
          duration: 0.5,
        },
        `<${options.circleDelay}`,
      )
      .to(
        circles,
        {
          scale: 1,
          stagger: 0.4,
          duration: 0.5,
        },
        "<0.5",
      );
  }
  return timeline;
};

function buildAllTimelines(timelineConfigs, circleQuery) {
  const timelines = timelineConfigs.map(({ tlId, circleClass, lineAni }) =>
    BulidTimeline(tlId, circleQuery, circleClass, {
      circleDelay: 6.2,
      paused: true,
      lineAni: {
        strokeDashoffset: 0,
        duration: 1,
        ease: "none",
      },
    }),
  );
  return timelines;
}

const timelineAnimationConfigs = [
  {
    tlId: "MainLine",
    circleClass: ".Main-Circle",
    lineAni: {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    },
  },
  {
    tlId: "FL",
    circleClass: ".FL-Circle",
    lineAni: {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    },
  },
  {
    tlId: "NL",
    circleClass: ".NL-Circle",
    lineAni: {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    },
  },
  {
    tlId: "NR",
    circleClass: ".NR-Circle",
    lineAni: {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    },
  },
  {
    tlId: "FR",
    circleClass: ".FR-Circle",
    lineAni: {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    },
  },
];

export default function About2(props) {
  const [hasMounted, setHasMounted] = useState(false);
  const [introAlreadyMounted, setIntroAlreadyMounted] = useState(false);
  const [tooltipConfig, setTooltipConfig] = useState(null);
  const svgRef = useRef(null);

  const redTimeline = useRef(null);
  const otherTimelines = useRef(null);
  const {
    width: pageWidth,
    height: pageHeight,
    ref: pageRef,
  } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 300,
  });

  const [redLineAniRef, redLineInView] = useInView();
  const [otherLinesAniRef, otherLinesInView] = useInView();
  const renderTooltip = (e, description) => {
    const bounds = pageRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left - 120; // shift x by alot to the left
    const y = e.clientY - bounds.top;
    setTooltipConfig({ x, y, description });
  };
  useEffect(() => {
    if (hasMounted) {
      const circleQuery = gsap.utils.selector(svgRef);
      const timelines = buildAllTimelines(
        timelineAnimationConfigs,
        circleQuery,
      );
      redTimeline.current = timelines[0];
      otherTimelines.current = gsap.timeline({ paused: true });
      timelines.forEach((timeline, index) => {
        if (index === 1) {
          otherTimelines.current.add(timeline, "<");
        } else if (index !== 0) {
          otherTimelines.current.add(timeline, "<2");
        }
      });
    }
  }, [hasMounted]);
  useEffect(() => setHasMounted(true));
  useEffect(() => {
    if (otherLinesInView) {
      otherTimelines?.current.play();
    }
  }, [otherLinesInView]);

  if (props.triggerTlIntro && redTimeline.current !== null)
    setTimeout(() => redTimeline.current.play(), 1000);

  return (
    <StyledPage ref={pageRef}>
      {pageRef.current !== null &&
        svgRef.current !== null &&
        props.blurbs.map(({ metadata, content }) => (
          <ContentBoxMachine
            key={metadata.key}
            boxData={{
              boxId: metadata.key,
              content,
              title: metadata.title,
              x: metadata.x,
              y: metadata.y,
            }}
            svgData={{
              cd: metadata.cd,
              ld: metadata.ld,
              ad: metadata.ad,
              svgRef: svgRef.current,
            }}
            pageData={{
              pageWidth,
              pageHeight,
              pageRef: pageRef.current,
            }}
          />
        ))}
      <svg
        version="1.1"
        className="SVGContainer"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={`${-VIEWBOX_SHIFT_X} 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
      >
        <StyledLine
          id="FL"
          color="#FF6319"
          d="M1818.9,2976.7L249,3243.2l-2.6,3243.2"
        />
        <StyledLine
          id="NL"
          color="#0039A6"
          d="M1814.1,2976.3l-503.4,210.9l4.3,3299.2"
        />
        <StyledLine
          id="NR"
          color="#FCCC0A"
          d="M1814.7,2974.9l489.4,210.9l3.7,3300.7"
        />
        <StyledLine
          id="FR"
          color="#00933C"
          d="M1807,2976.3l1571.9,266.9l-2.6,3243.2"
        />
        <StyledLine
          onMouseOver={(e) => renderTooltip(e, "Main timeline")}
          onMouseOut={() => setTooltipConfig(null)}
          id="MainLine"
          color="#EE352E"
          d="M1728.4,0v101.8l-66.8,43.2v4.1V809l150,224.6l2.6,1964.4"
        />
        <g ref={svgRef} style={{ outline: "none" }} />
      </svg>
      <div
        ref={otherLinesAniRef}
        style={{
          position: "absolute",
          opacity: 0,
          top: "50%",
        }}
      />
      {(props.triggerTlIntro || introAlreadyMounted) && (
        <TimelineIntro setReleaseScroll={props.setReleaseScroll} />
      )}
    </StyledPage>
  );
}
