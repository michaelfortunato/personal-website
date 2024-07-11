import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export function resolveURLToTheme(pathname: string) {
  const map: any = {
    "/": "home-light",
    "/about": "about-light",
    "/projects": "projects-light",
    "/blog": "blog-light",
  };
  return map[pathname] ?? "unknown";
}

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const theme = resolveURLToTheme(pathname as string);
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
