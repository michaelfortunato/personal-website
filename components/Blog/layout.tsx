import { blogInitialsFont } from "@/lib/fonts";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { BuildInfo, SerializedBuildInfo } from "@/lib/buildInfo";
import BuildStamp from "@/components/BuildStamp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
type Props = {
  children: React.ReactNode;
  websiteWideBuildInfo?: SerializedBuildInfo;
};

function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <div className={`px-16 md:flex md:items-center md:justify-between `}>
      <div className="flex justify-center">
        <Link
          href="/blog"
          className={`hidden md:inline-block bold ${blogInitialsFont.className} text-4xl relative inline-block after:content-['.'] after:absolute after:left-full`}
        >
          mnf
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`md:hidden bold ${blogInitialsFont.className} text-4xl relative inline-block after:content-['.'] after:absolute after:left-full`}
            asChild
          >
            <button>mnf</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/blog/on-work">On Work</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/blog/on-quiet">On Quiet</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              onValueChange={(value) => setTheme(value)}
              value={theme}
              className="flex"
            >
              <DropdownMenuRadioItem
                onSelect={(e) => e.preventDefault()}
                value="light"
              >
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                onSelect={(e) => e.preventDefault()}
                value="dark"
              >
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                onSelect={(e) => e.preventDefault()}
                value="system"
              >
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
