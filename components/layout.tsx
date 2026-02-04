import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

export function resolveURLToTheme(pathname: string) {
  if (pathname === "/") return "home-light";
  if (pathname.startsWith("/about")) return "about-light";
  if (pathname.startsWith("/projects")) return "projects-light";
  if (pathname.startsWith("/blog")) return "blog-light";
  return "unknown";
}

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const theme = resolveURLToTheme(router.asPath);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (theme == "unknown") {
      setTheme(`system`);
      return;
    }
    setTheme(`${theme}`);
  }, [setTheme, theme]);

  return <>{children}</>;
}
