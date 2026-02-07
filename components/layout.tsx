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
  const routeTheme = resolveURLToTheme(router.asPath);
  const { theme: selectedTheme, setTheme } = useTheme();

  useEffect(() => {
    // If the user explicitly selected light/dark, don't override it based on route.
    if (selectedTheme === "light" || selectedTheme === "dark") {
      return;
    }

    if (routeTheme == "unknown") {
      setTheme("system");
      return;
    }
    setTheme(routeTheme);
  }, [routeTheme, selectedTheme, setTheme]);

  return <>{children}</>;
}
