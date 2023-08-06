import "../styles/globals.css";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { AppProps } from "next/app";

import { CacheProvider, EmotionCache } from "@emotion/react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Navbar from "@components/Nav/Navbar";
import axios from "axios";
import { SWRConfig } from "swr";
import {
	aboutTheme,
	blogTheme,
	indexTheme,
	projectsTheme
} from "@components/theme";
import createEmotionCache from "@components/createEmotionCache";
import { ScopedCssBaseline, Theme } from "@mui/material";

const StyledRoot = styled(motion.div)`
	position: absolute;
	width: 100vw;
	height: 100vh;
`;

// TODO: Properly type this
// TODO: Move these into their respective components

type RootConfig = {
	name: string;
	theme: Theme;
	previewColor?: string; // TODO: REMOVE
	previewTextColor?: string; // TODO: REMOVE
	transition?: { backgroundColor: string }; // TODO: REMOVE
};

const pageConfigs: { [key: string]: RootConfig } = {
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
const userRoutes: any = {};
Object.entries(pageConfigs).forEach(([url, obj]) => {
	if (url !== "/_error" && url !== "/404" && url !== "/504") {
		userRoutes[url] = obj;
	}
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}
export default function App({
	Component,
	pageProps,
	emotionCache = clientSideEmotionCache
}: MyAppProps) {
	const mainRef = useRef(null);
	const router = useRouter();
	// TODO: Remove this nastiness below
	const pathname = `/${router.pathname.split("/")[1]}`;
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
				<meta name="description" content="Michael Fortunato Website" />
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<link rel="icon" href="" />
			</Head>
			<main ref={mainRef}>
				<ThemeProvider theme={pageConfigs[pathname].theme}>
					<Navbar
						routes={userRoutes}
						currentPage={pathname}
						mainRef={mainRef}
					/>
					<StyledRoot
						animate={{
							...pageConfigs[pathname].transition,
							transition: {
								duration: 0.3
							}
						}}
					>
						<ScopedCssBaseline />
						<Component key={pathname} {...pageProps} />
					</StyledRoot>
				</ThemeProvider>
			</main>
		</CacheProvider>
	);
}
