import { motion } from "framer-motion";
import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "./Nav/Navbar";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Toaster } from "./ui/toaster";

export type RootPageStyle = {
  name: string;
  previewColor: string;
  previewTextColor: string;
  backgroundColor: string;
};

const pageConfigs: Record<string, RootPageStyle> = {
  "/": {
    name: "Home",
    previewColor: "rgba(230, 175, 75, 1)",
    previewTextColor: "#264653",
    backgroundColor: "#e6af4b",
  },
  "/about": {
    name: "About",
    previewColor: "rgba(20, 33, 61, 1)",
    previewTextColor: "#e6af4b",
    backgroundColor: "#14213D",
  },
  "/projects": {
    name: "Projects",
    previewColor: "#D5E5E5",
    previewTextColor: "#e6af4b",
    backgroundColor: "#D5E5E5",
  },
  "/blog": {
    name: "Blog",
    previewColor: "#14213D",
    previewTextColor: "#e6af4b",
    backgroundColor: "#14213D",
  },
};

export function pathnameToThemeClass(pathname: string) {
  const map: any = { "/": "home", "/about": "about", "/projects": "projects" };
  return map[pathname] ?? "unknown";
}

export default function RootPageLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const theme = pathnameToThemeClass(pathname);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (theme == "unknown") {
      setTheme(`light`);
      return;
    }
    setTheme(`${theme}-light`);
  }, [setTheme, theme]);

  return (
    <div>
      <Navbar routes={pageConfigs} />
      <div className="absolute min-h-screen min-w-full bg-background transition duration-1000">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
