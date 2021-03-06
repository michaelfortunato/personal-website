import "../styles/globals.css";

import React, { useState, useEffect, useRef } from "react";

import { createTheme, StylesProvider } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { useRouter } from "next/router";
import "@fontsource/roboto";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import styled from "styled-components";
import Navbar from "@components/Nav/Navbar";
import axios from "axios";
import { SWRConfig } from "swr";
const StyledRoot = styled(motion.div)`
	background-color: #e6af4b;
`;

const routes = {
	"/": {
		name: "Home",
		theme: createTheme({
			palette: {
				primary: {
					main: "#e6af4b"
				},
				secondary: {
					main: "#264653"
				}
			}
		}),
		previewColor: "rgba(230, 175, 75, 1)",
		previewTextColor: "#264653",
		transition: { backgroundColor: "#e6af4b" }
	},
	"/about": {
		name: "About",
		theme: createTheme({
			palette: {
				primary: {
					main: "#14213D"
				},
				secondary: {
					main: "#fafafa"
				},
				text: {
					primary: "#fff"
				}
			}
		}),
		previewColor: "rgba(20, 33, 61, 1)",
		previewTextColor: "#e6af4b",
		transition: { backgroundColor: "#14213D" }
	},
	"/projects": {
		name: "Projects",
		theme: createTheme({
			palette: {
				primary: {
					main: "#14213D"
				},
				secondary: {
					main: "#fafafa"
				},
				text: {
					primary: "#fff"
				}
			}
		}),
		previewColor: "#14213D",
		previewTextColor: "#e6af4b",
		transition: { backgroundColor: "#14213D" }
	},
	"/blog": {
		name: "Blog",
		theme: createTheme({
			palette: {
				primary: {
					main: "#14213D"
				},
				secondary: {
					main: "#fafafa"
				},
				text: {
					primary: "#fff"
				}
			}
		}),
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

const userRoutes = {};
Object.entries(routes).forEach(([url, obj]) => {
	if (url !== "/_error" && url !== "/404" && url !== "/504") {
		userRoutes[url] = obj;
	}
});
export default function App({ Component, pageProps }) {
	const mainRef = useRef(null);
	const router = useRouter();
	const pathname = "/" + router.pathname.split("/")[1];
	useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	console.log(pathname);
	return (
		<div>
			<Head>
				<title>Michael Fortunato</title>
				<meta name="description" content="Michael Fortunato Website" />
				<link rel="icon" href="" />
			</Head>
			<main ref={mainRef}>
				<div>
					<StylesProvider injectFirst>
						<MuiThemeProvider theme={routes[pathname].theme}>
							<StyledComponentsThemeProvider
								theme={routes[pathname].theme}
							>
								<SWRConfig
									value={{
										fetcher: url =>
											axios.get(url).then(res => res.data)
									}}
								>
									<Navbar
										routes={userRoutes}
										currentPage={pathname}
										mainRef={mainRef}
									/>
									<AnimatePresence initial={false}>
										<StyledRoot
											animate={{
												...routes[pathname].transition,
												transition: {
													delay: 0.6,
													duration: 0.3
												}
											}}
										>
											<AnimatePresence exitBeforeEnter>
												<Component
													key={pathname}
													{...pageProps}
												/>
											</AnimatePresence>
										</StyledRoot>
									</AnimatePresence>
								</SWRConfig>
							</StyledComponentsThemeProvider>
						</MuiThemeProvider>
					</StylesProvider>
				</div>
			</main>
		</div>
	);
}
