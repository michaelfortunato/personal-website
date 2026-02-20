import { blogInitialsFont } from "@/lib/fonts";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { BuildInfo } from "@/lib/buildInfo";
import BuildStamp from "@/components/BuildStamp";
type Props = {
  children: React.ReactNode;
  websiteWideBuildInfo?: BuildInfo;
};

function Header() {
  return (
    <div className={`flex items-center justify-between px-16`}>
      <Link
        href="/blog"
        className={`bold ${blogInitialsFont.className} text-4xl`}
      >
        mnf.
      </Link>
      <div className="flex gap-4">
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
            <BuildStamp buildInfo={props.websiteWideBuildInfo} />
          </footer>
        </div>
      ) : null}
    </div>
  );
};

export default Layout;
