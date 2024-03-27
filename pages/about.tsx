import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRef } from "lottie-react";
import animationData from "@/public/About_Page1_ISA-Loop.json";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NextPageWithLayout } from "./_app";
import RootPageLayout from "@/components/RootPageLayout";

const AboutRoot = styled(motion.div)`
  width: 100%;
  overflow-x: hidden;
`;
const StyledPage = styled(motion.div)`
  width: 100vw;
  overflow-x: hidden;
  height: 100vh;
  position: relative;
`;

const Page: NextPageWithLayout = () => {
  const lottieRef = useRef(null) as LottieRef;
  const [isXL, setIsXL] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [triggerAniRef, isAniInView] = useInView({ initialInView: true });

  useEffect(() => {
    if (hasMounted && lottieRef.current) {
      if (isAniInView) lottieRef.current.play();
    }
  }, [isAniInView]);

  useEffect(() => {
    // Set a timer that delays the animation
    setTimeout(() => {
      // Make sure reference is valid
      if (!lottieRef.current) return;

      lottieRef.current.playSegments(
        [
          [0, 693],
          [693, 883],
        ],
        true,
      );
    }, 500);
    if (window.matchMedia("(min-width: 3000px)").matches) {
      setIsXL(true);
    }
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <AboutRoot
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { delay: 0.6, duration: 0.3 } }}
    >
      <StyledPage key={1}>
        <Lottie
          lottieRef={lottieRef}
          style={!isXL ? { height: "100vh" } : {}}
          loop
          autoplay={false}
          animationData={animationData}
        />
        <div
          ref={triggerAniRef}
          style={{
            opacity: 0,
            position: "absolute",
            left: "50%",
            top: "20%",
          }}
        />
      </StyledPage>
      {/* <About2 blurbs={props.blurbs} triggerTlIntro={triggerTlIntro} key={2} /> */}
    </AboutRoot>
  );
};

Page.getLayout = (page) => {
  return <RootPageLayout>{page}</RootPageLayout>;
};

export default Page;
