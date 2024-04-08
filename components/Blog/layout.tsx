import { blogInitialsFont } from "@/lib/fonts";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
type Props = {
  preview?: boolean;
  children: React.ReactNode;
};

function Header() {
  return (
    <div className={`flex items-center justify-between py-2`}>
      <Link
        href="/blog"
        className={`bold ${blogInitialsFont.className} text-4xl`}
      >
        mnf.
      </Link>
      <div className="flex gap-1">
        <Link href="/on-work">On Work</Link>
        <ThemeSwitch />
      </div>
    </div>
  );
}

const Layout = ({ preview, children }: Props) => {
  return (
    <div className="container min-h-screen">
      <Header />
      <article>{children}</article>
    </div>
  );
};

export default Layout;
