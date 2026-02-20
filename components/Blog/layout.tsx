import { blogInitialsFont } from "@/lib/fonts";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { BuildInfo, SerializedBuildInfo } from "@/lib/buildInfo";
import BuildStamp from "@/components/BuildStamp";
type Props = {
  children: React.ReactNode;
  websiteWideBuildInfo?: SerializedBuildInfo;
};

function Header() {
  return (
    <div className={`px-16 md:flex md:items-center md:justify-between `}>
      <div className="flex justify-center">
        <Link
          href="/blog"
          className={`bold ${blogInitialsFont.className} text-4xl relative inline-block after:content-['.'] after:absolute after:left-full`}
        >
          mnf
        </Link>
      </div>
      <div className="hidden md:flex md:gap-4">
        <Link href="/blog/on-work">On Work</Link>
        <Link href="/blog/on-quiet">On Quiet</Link>
        <ThemeSwitch />
      </div>
    </div>
  );
}

const Layout = (props: Props) => {
  return (
    <div className="container flex flex-col min-h-screen">
      <div className="invisible h-16 w-full" />
      <Header />
      <div className="invisible h-20 w-full" />
      <article>{props.children}</article>
      {props.websiteWideBuildInfo ? (
        <div className="flex-grow flex flex-col justify-end">
          <footer className="w-full text-muted-foreground mt-auto">
            <BuildStamp serializedBuildInfo={props.websiteWideBuildInfo} />
          </footer>
        </div>
      ) : null}
    </div>
  );
};

export default Layout;
