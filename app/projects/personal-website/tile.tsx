import Image from "next/image";
import clayiPhone from "@/public/projects/clay-iphone.svg";
import clayMBP from "@/public/projects/clay-mbp.svg";
import { TileFactory } from "../TileFactory";

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

export function Tile() {
  return <WebsiteTile />;
}
