import "../styles/globals.css";

import { type ReactElement, type ReactNode } from "react";
import Head from "next/head";
import { AppProps } from "next/app";

import { GoogleAnalytics } from "@next/third-parties/google";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { NextPage } from "next";
import { buildManfestHeadingFont } from "@/lib/fonts";
import { ThemeProvider } from "@/components/themeProvider";
import Layout from "@/components/layout";

export type GetLayout = (page: ReactElement) => ReactNode;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

export type MyAppProps = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: MyAppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Michael Fortunato</title>
        <meta name="description" content="Michael Fortunato's Website" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="" />
      </Head>
      <ThemeProvider
        attribute="class"
        enableSystem
        disableTransitionOnChange={false}
        themes={[
          "light",
          "dark",
          "system",
          "home-light",
          "home-dark",
          "about-light",
          "about-light",
          "projects-light",
          "projects-dark",
          "blog-light",
          "blog-dark",
          "x",
        ]}
      >
        <main
          className={cn(
            "min-h-screen w-full font-sans antialiased",
            buildManfestHeadingFont.variable,
          )}
        >
          <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
          <GoogleAnalytics gaId="G-PG5ZXTMN4Z" />
        </main>
      </ThemeProvider>
      <SpeedInsights /> {/* NOTE: For diagnostics*/}
    </>
  );
}
