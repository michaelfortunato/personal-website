import "../styles/globals.css";

import React, { useEffect, ReactElement, ReactNode } from "react";
import Head from "next/head";
import { AppProps } from "next/app";

import { CacheProvider, EmotionCache } from "@emotion/react";

import createEmotionCache from "@/components/createEmotionCache";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "lib/utils";
import { NextPage } from "next";

export type GetLayout = (page: ReactElement) => ReactNode;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: GetLayout;
};

export type MyAppProps = AppProps & {
	Component: NextPageWithLayout;
	emotionCache?: EmotionCache;
};

// Client-side cache, shared for the whole session of the user in the browser.
// Deprecated, probably as we will move to style-jsx?
const clientSideEmotionCache = createEmotionCache();

export default function App({
	Component,
	pageProps,
	emotionCache = clientSideEmotionCache
}: MyAppProps) {
	useEffect(() => {
		// Remove the server-side injected CSS.
		// TODO: Is this MUI or emotion, probably emotion?
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles?.parentElement?.removeChild(jssStyles);
		}
	}, []);
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? (page => page);

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>Michael Fortunato</title>
				<meta name="description" content="Michael Fortunato's Website" />
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<link rel="icon" href="" />
			</Head>
			<main className={cn("min-h-screen bg-background font-sans antialiased")}>
				<SpeedInsights /> {/* NOTE: For diagnostics*/}
				{getLayout(<Component {...pageProps} />)}
			</main>
		</CacheProvider>
	);
}
