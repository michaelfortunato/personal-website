import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Michael Fortunato",
  description: "Michael Fortunato's Personal Website",
};

export function resolveURLToTheme(pathname: string) {
  const map: any = {
    "/": "home-light",
    "/about": "about-light",
    "/projects": "projects-light",
    "/blog": "blog-light",
  };
  return map[pathname] ?? "unknown";
}

export default async function RootLayout({ children }: PropsWithChildren) {
  // const pathname = usePathname();
  // const theme = resolveURLToTheme(pathname);
  // const { setTheme } = useTheme();

  // useEffect(() => {
  //   if (theme == "unknown") {
  //     setTheme(`system`);
  //     return;
  //   }
  //   setTheme(`${theme}`);
  // }, [setTheme, theme]);
  //
  //

  return (
    <html lang="en">
      <body className="min-h-screen w-full font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
