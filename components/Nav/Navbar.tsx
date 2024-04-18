import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Twirl as Hamburger } from "hamburger-react";
import { gsap } from "gsap";
import { RootPageStyle } from "../RootPageLayout";

export type NavbarProps = {
  routes: Record<string, RootPageStyle>;
};

export default function Navbar(props: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  // TODO: const { theme } = useTheme();
  return (
    <div className="fixed z-50">
      <div className="fixed z-[1] inline-block p-6">
        <div
          style={isVisible ? { color: "#FFFFFF" } : { color: "initial" }}
          // transition={{ color: { duration: 1 } }}
        >
          <Hamburger
            duration={0.2}
            toggled={isVisible}
            toggle={() => setIsVisible(!isVisible)}
          />
        </div>
      </div>
      <NavPage
        routes={props.routes}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </div>
  );
}

export type NavPageProps = {
  routes: Record<string, RootPageStyle>;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

const NavPage = (props: NavPageProps) => {
  const [previewUrl, setPreviewUrl] = useState<null | string>(null);
  return (
    <AnimatePresence initial={false}>
      {props.isVisible && (
        <motion.div
          className="relative left-0 top-0 h-screen w-screen"
          // style={{ originY: 0, backgroundColor: "#49474d" }}
          initial={{ translateY: "-100%" }}
          animate={{
            backgroundColor: true
              ? "#FFFFFF"
              : previewUrl !== null
                ? props.routes[previewUrl].previewColor
                : "rgba(73, 71, 77, 1)",
            translateY: 0,
            transition: { duration: 0.5 },
          }}
          exit={{ translateY: "-100%", transition: { duration: 0.5 } }}
        >
          <NavContent
            routes={props.routes}
            setIsVisible={props.setIsVisible}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type NavContentProps = {
  routes: Record<string, RootPageStyle>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  previewUrl: string | null;
  setPreviewUrl: Dispatch<SetStateAction<string | null>>;
};

const NavContent = (props: NavContentProps) => {
  const navContentRef = useRef(null);
  const linksQuery = gsap.utils.selector(navContentRef);
  useEffect(() => {
    const links = linksQuery(".links");
    gsap.fromTo(
      links,
      { x: -400, y: -200, rotation: 30 },
      { x: 0, y: 0, rotation: 0, delay: 0.2, duration: 0.3, stagger: 0.08 },
    );
  }, []);
  return (
    <div ref={navContentRef} className="flex h-full">
      <div className=" flex h-full flex-1 flex-col items-center justify-center gap-4 md:flex-[4] lg:gap-24">
        {Object.entries(props.routes).map(([url, { name }]) => (
          <div className="links" key={url}>
            <motion.div
              animate={{
                color:
                  props.previewUrl !== null
                    ? props.routes[props.previewUrl]?.previewTextColor ??
                      "#FFFFFF"
                    : "#FFFFFF",
              }}
              transition={{ color: { duration: 1 } }}
              onMouseOver={() => props.setPreviewUrl(url)}
              onMouseLeave={() => props.setPreviewUrl(null)}
              onClick={() => props.setIsVisible(false)}
              style={{ display: "inline-block" }}
            >
              <Link href={url}>
                <motion.h2
                  className="text-6xl lg:text-7xl"
                  animate={{
                    scale: url === props.previewUrl ? 1 : 1,
                    translateX: url === props.previewUrl ? "10px" : 0,
                    translateY: url === props.previewUrl ? "-10px" : 0,
                  }}
                >
                  {name}
                </motion.h2>
              </Link>
              <AnimatePresence initial={false}>
                <motion.div
                  style={{ transformOrigin: "50%" }}
                  animate={{
                    scaleX: url === props.previewUrl ? 1.1 : 0,
                  }}
                >
                  <hr className="h-[2px] bg-white" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="md:flex-[8]" />
    </div>
  );
};
