import { blogInitialsFont } from "@/lib/fonts";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/theme-switch";
type Props = {
  preview?: boolean;
  children: React.ReactNode;
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
        <Link href="/on-work">On Work</Link>
        <Link href="/on-quiet">On Quiet</Link>
        <ThemeSwitch />
      </div>
    </div>
  );
}

const PostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container min-h-screen">
      <div className="invisible h-16 w-full" />
      <Header />
      <div className="invisible h-20 w-full" />
      <article>{children}</article>
    </div>
  );
};

export default PostLayout;
