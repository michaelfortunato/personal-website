import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Twirl as Hamburger } from "hamburger-react";
import { gsap } from "gsap";
import { resolveURLToTheme } from "@/components/layout";
import { RootPageStyle } from "@/components/RootPageLayout";

export type NavbarProps = {
  routes: Record<string, RootPageStyle>;
};

export default function Navbar(props: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="fixed z-50">
      <div className="fixed z-[1] inline-block p-6">
        <div>
          <Hamburger
            hideOutline={false}
            label={"Menu button"}
            color={"hsl(var(--foreground))"}
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
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  return (
    <AnimatePresence initial={false}>
      {props.isVisible && (
        <motion.div
          className={`relative left-0 top-0 h-screen w-screen ${previewURL && resolveURLToTheme(previewURL)}`}
          initial={{ translateY: "-100%" }}
          animate={{
            translateY: 0,
            transition: { duration: 0.5 },
          }}
          exit={{ translateY: "-100%", transition: { duration: 0.5 } }}
        >
          <NavContent
            routes={props.routes}
            setIsVisible={props.setIsVisible}
            previewURL={previewURL}
            setPreviewURL={setPreviewURL}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type NavContentProps = {
  routes: Record<string, RootPageStyle>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  previewURL: string | null;
  setPreviewURL: Dispatch<SetStateAction<string | null>>;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={navContentRef}
      className="flex h-full bg-background transition duration-300"
    >
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 md:flex-[4] lg:gap-24">
        {Object.entries(props.routes).map(([url, { name }]) => (
          <div className="links" key={url}>
            <div
              onMouseOver={() => props.setPreviewURL(url)}
              onMouseOut={() => props.setPreviewURL(null)}
              onClick={() => {
                props.setIsVisible(false);
              }}
              className="inline-block"
            >
              <Link
                href={url}
                className="text-foreground transition-all duration-1000"
              >
                <motion.h2
                  className="text-6xl lg:text-7xl"
                  animate={{
                    translateX: url == props.previewURL ? "10px" : "0px",
                    translateY: url == props.previewURL ? "-10px" : "0px",
                  }}
                >
                  {name}
                </motion.h2>
              </Link>
              <AnimatePresence initial={false}>
                <motion.div
                  style={{ transformOrigin: "50%" }}
                  animate={{
                    scaleX: url == props.previewURL ? 1.1 : 0,
                  }}
                >
                  <hr className="border-foreground bg-inherit text-inherit" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      <div className="md:flex-[8]" />
    </div>
  );
};
