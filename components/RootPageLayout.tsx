import { PropsWithChildren } from "react";
import Navbar from "./Nav/Navbar";
import { Toaster } from "./ui/toaster";
import { BuildInfo, SerializedBuildInfo } from "@/lib/buildInfo";
import BuildStamp from "@/components/BuildStamp";

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
  // FIXME: Get about in a better place before letting recruiters see.
  // "/about": {
  //   name: "About",
  //   previewColor: "rgba(20, 33, 61, 1)",
  //   previewTextColor: "#e6af4b",
  //   backgroundColor: "#14213D",
  // },
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

export default function RootPageLayout({
  children,
  serializedBuildInfo,
}: PropsWithChildren<{ serializedBuildInfo: SerializedBuildInfo }>) {
  return (
    <div>
      <Navbar routes={pageConfigs} />
      <div className="absolute min-h-screen min-w-full bg-background transition duration-1000">
        {children}
        <div className="absolute bottom-0 left-0 w-full">
          <BuildStamp serializedBuildInfo={serializedBuildInfo} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
