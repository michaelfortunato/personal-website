import { PropsWithChildren } from "react";
import { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Nav/Navbar";
import BuildStamp from "@/components/BuildStamp";
import { Toaster } from "@/components/ui/toaster";
import { getBuildInfo } from "@/lib/server-only/buildInfo";

export const metadata: Metadata = {
  title: "Michael Fortunato",
  description: "Michael Fortunato's Personal Website",
};

export type RootPageStyle = {
  name: string;
  previewColor: string;
  previewTextColor: string;
  backgroundColor: string;
};

/// TODO: REMOVE This method and come with a smarter one
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
export default async function Layout({ children }: PropsWithChildren) {
  const buildInfo = await getBuildInfo();

  return (
    <html lang="en">
      <body className="min-h-screen w-full font-sans antialiased">
        <div>
          <Navbar routes={pageConfigs} />
          <div className="absolute min-h-screen min-w-full bg-background transition duration-1000">
            {children}
            <div className="absolute bottom-0 left-0 w-full">
              <BuildStamp buildInfo={buildInfo} />
            </div>
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
