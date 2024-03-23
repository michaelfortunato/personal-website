import "../styles/globals.css";

import React, {
	useState,
	useEffect,
	useRef,
	ReactElement,
	ReactNode
} from "react";
import Head from "next/head";
import { AppProps } from "next/app";

import { CacheProvider, EmotionCache } from "@emotion/react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Navbar from "@/components/Nav/Navbar";
import {
	aboutTheme,
	blogTheme,
	indexTheme,
	projectsTheme
} from "@/components/theme";
import createEmotionCache from "@/components/createEmotionCache";
import { Theme } from "@mui/material";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "lib/utils";
import { NextPage } from "next";

// TODO: Properly type this
// TODO: Move these into their respective components

export type RootPageTheme = {
	name: string;
	theme: Theme | null;
	previewColor?: string; // TODO: REMOVE
	previewTextColor?: string; // TODO: REMOVE
	transition?: { backgroundColor: string }; // TODO: REMOVE
};

const pageConfigs: { [key: string]: RootPageTheme } = {
	"/": {
		name: "Home",
		theme: indexTheme,
		previewColor: "rgba(230, 175, 75, 1)",
		previewTextColor: "#264653",
		transition: { backgroundColor: "#e6af4b" }
	},
	"/about": {
		name: "About",
		theme: aboutTheme,
		previewColor: "rgba(20, 33, 61, 1)",
		previewTextColor: "#e6af4b",
		transition: { backgroundColor: "#14213D" }
	},
	"/projects": {
		name: "Projects",
		theme: projectsTheme,
		previewColor: "#D5E5E5",
		previewTextColor: "#e6af4b",
		transition: { backgroundColor: "#D5E5E5" }
	},
	"/blog": {
		name: "Blog",
		theme: blogTheme,
		previewColor: "#14213D",
		previewTextColor: "#e6af4b",
		transition: { backgroundColor: "#14213D" }
	},
	"/_error": {
		name: "/_error",
		theme: createTheme({})
	},
	"/404": {
		name: "/404",
		theme: createTheme({})
	},
	"/504": {
		name: "/504",
		theme: createTheme({})
	}
};

// TODO: Properly type this
const userRoutes: { [key: string]: any } = {};
Object.entries(pageConfigs).forEach(([url, obj]) => {
	if (url !== "/_error" && url !== "/404" && url !== "/504") {
		userRoutes[url] = obj;
	}
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type MyAppProps = AppProps & {
	Component: NextPageWithLayout;
	emotionCache?: EmotionCache;
};

export default function App({
	Component,
	pageProps,
	emotionCache = clientSideEmotionCache
}: MyAppProps) {
	const router = useRouter();
	// TODO: Remove this nastiness below
	const pathname = router.pathname;

	useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles?.parentElement?.removeChild(jssStyles);
		}
	}, []);

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
				{pathname in userRoutes ? (
					<>
						<Navbar routes={userRoutes} currentPage={pathname} />

						<motion.div
							className="absolute min-h-screen min-w-[100vw]"
							animate={{
								...pageConfigs[pathname].transition,
								transition: {
									duration: 0.3
								}
							}}
						>
							<Component key={pathname} {...pageProps} />
						</motion.div>
					</>
				) : (
					<Component key={pathname} {...pageProps} />
				)}
			</main>
		</CacheProvider>
	);
}
