import { Box, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layout, TileFactory } from ".";
import Image from "next/image";
import clayiPhone from "@/public/projects/clay-iphone.svg";
import clayMBP from "@/public/projects/clay-mbp.svg";
import bundleSizes from "@/public/projects/personal-website/bundle-sizes.png";

export function Tile() {
  return <WebsiteTile />;
}

function WebsiteTile() {
  const leftHandSize = () => (
    <div className="container flex flex-col gap-4">
      <div className="text-base">
        This website is a public vault of my life, and there is heavy emphasis
        on intricate animations. It was built using NextJS, TailwindCSS, and
        Framer Motion.
      </div>
    </div>
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
  return TileFactory(
    "Personal Website",
    leftHandSize(),
    rightHandside(),
    "personal-website",
  );
}

export default function Page() {
  return (
    <Layout url="/projects/personal-website">
      <div className="flex justify-center">
        <h1 className="text-6xl">Personal Website</h1>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="prose">
          <p>
            This uses a bunch of different technologies, like NextJS, GSAP, raw
            CSS animations, Framer Motion, Tailwind CSS. The first page takes
            awhile to load. I thought it had to do with the large JS payload. I
            did a bundle analyzer.
          </p>
          <h2>Bundle Analysis</h2>
          <p>
            While these sizes are not ideal, it turns out AWS cold starts were
            to blame. After switching to Vercel, the time to first contentful
            paint is in good UX range.
          </p>
          <div className="flex justify-center">
            <Image
              src={bundleSizes}
              width={600}
              height={600}
              alt="bundle size image"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
