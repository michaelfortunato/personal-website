import { blogInitialsFont } from "@/lib/fonts";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
type Props = {
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
        <Link href="/blog/on-work">On Work</Link>
        <Link href="/blog/on-quiet">On Quiet</Link>
        <ThemeSwitch />
      </div>
    </div>
  );
}

const Layout = ({ children }: Props) => {
  return (
    <div className="container min-h-screen">
      <div className="invisible h-16 w-full" />
      <Header />
      <div className="invisible h-20 w-full" />
      <article>{children}</article>
    </div>
  );
};

export default Layout;
