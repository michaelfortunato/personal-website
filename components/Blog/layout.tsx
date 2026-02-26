import { blogInitialsFont } from "@/lib/fonts";
import type { ReactNode } from "react";
import {
  BlogSettingsProvider,
  useBlogSettings,
} from "@/components/Blog/settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroupLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLinkItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Ellipsis } from "lucide-react";
type Props = {
  children: ReactNode;
  isIndexPage: boolean;
  footer?: ReactNode;
};

function MNFMenu(props: { variant: "index" | "note" }) {
  const { theme, setTheme } = useTheme();
  const {
    settings: { showCommitInformation },
    setShowCommitInformation,
  } = useBlogSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`md:inline-block bold ${blogInitialsFont.className} text-4xl relative inline-block after:content-['.'] after:absolute after:left-full`}
        render={<button>mnf</button>}
      />
      <DropdownMenuContent className="" align="center">
        <DropdownMenuLinkItem href="/blog">Home</DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        {props.variant == "note" ? (
          <DropdownMenuGroup>
            <DropdownMenuGroupLabel>UI Elements</DropdownMenuGroupLabel>
            {/* Place holder */}
            <DropdownMenuCheckboxItem disabled>
              Table of Contents
            </DropdownMenuCheckboxItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Footer</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  checked={showCommitInformation}
                  onCheckedChange={(checked) =>
                    setShowCommitInformation(checked === true)
                  }
                >
                  Commit Information
                </DropdownMenuCheckboxItem>
                {/* Place holder */}
                <DropdownMenuCheckboxItem disabled>
                  {"Views & Likes"}
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        ) : null}
        <DropdownMenuGroup>
          <DropdownMenuGroupLabel>Theme</DropdownMenuGroupLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value) => setTheme(value)}
            value={theme}
          >
            <DropdownMenuRadioItem
              onSelect={(e) => e.preventDefault()}
              value="light"
              className="hover:cursor-pointer"
            >
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onSelect={(e) => e.preventDefault()}
              value="dark"
              className="hover:cursor-pointer"
            >
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onSelect={(e) => e.preventDefault()}
              value="system"
              className="hover:cursor-pointer"
            >
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header(props: { isIndexPage: boolean }) {
  return (
    <div className={`px-16 md:flex md:items-center md:justify-between `}>
      <div className="flex justify-center">
        <MNFMenu variant={props.isIndexPage ? "index" : "note"} />
      </div>
      <div className="hidden md:flex md:gap-4">
        {/* TODO: What to put here ? */}
        {/* <Link href="/blog/on-work">On Work</Link> */}
        {/* <Link href="/blog/on-quiet">On Quiet</Link> */}
        {/* <ThemeSwitch /> */}
      </div>
    </div>
  );
}

const Layout = (props: Props) => {
  return (
    <BlogSettingsProvider>
      <div className="container flex flex-col min-h-screen">
        <div className="invisible h-16 w-full" />
        <Header isIndexPage={props.isIndexPage} />
        <div className="invisible h-20 w-full" />
        <article>{props.children}</article>
        {props.footer ? (
          <div className="flex-grow flex flex-col justify-end">
            <footer className="w-full text-xs leading-tight text-muted-foreground mt-auto">
              {props.footer}
            </footer>
          </div>
        ) : null}
      </div>
    </BlogSettingsProvider>
  );
};

export default Layout;
