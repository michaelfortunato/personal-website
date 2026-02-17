import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieRef } from "lottie-react";
import animationData from "@/public/About_Page1_ISA-Loop.json";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NextPageWithLayout } from "./_app";
import RootPageLayout from "@/components/RootPageLayout";
import { getBuildInfo } from "@/lib/server-only/buildInfo";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Page: NextPageWithLayout = () => {
  const lottieRef = useRef(null) as LottieRef;
  const [isXL, setIsXL] = useState(false);
  const [triggerAniRef, isAniInView] = useInView({ initialInView: true });

  useEffect(() => {
    if (lottieRef.current) {
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

  return (
    <motion.div
      className="w-full overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { delay: 0.6, duration: 0.3 } }}
    >
      <motion.div
        key={1}
        className="relative h-screen w-screen overflow-x-hidden"
      >
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
      </motion.div>
      {/* <About2 blurbs={props.blurbs} triggerTlIntro={triggerTlIntro} key={2} /> */}
    </motion.div>
  );
};

Page.getLayout = (page) => {
  return (
    <RootPageLayout buildInfo={page.props.buildInfo}>{page}</RootPageLayout>
  );
};

Page.paletteClass = "about";


export async function getStaticProps() {
  // FIXME: Get about in a better place before letting recruiters see.
  return { notFound: true };

  return {
    props: { buildInfo: await getBuildInfo() },
  };
}

export default Page;
