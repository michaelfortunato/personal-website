import "../styles/globals.css";

import React, { useState, useEffect, useRef } from "react";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from "@mui/material/styles";
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
} from "styled-components";
import { useRouter } from "next/router";
import "@fontsource/roboto";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Navbar from "@components/Nav/Navbar";
import axios from "axios";
import { SWRConfig } from "swr";

const StyledRoot = styled(motion.div)`
  background-color: #e6af4b;
`;

const routes = {
  "/": {
    name: "Home",
    theme: createTheme(
      adaptV4Theme({
        palette: {
          primary: {
            main: "#e6af4b",
          },
          secondary: {
            main: "#264653",
          },
        },
      })
    ),
    previewColor: "rgba(230, 175, 75, 1)",
    previewTextColor: "#264653",
    transition: { backgroundColor: "#e6af4b" },
  },
  "/about": {
    name: "About",
    theme: createTheme(
      adaptV4Theme({
        palette: {
          primary: {
            main: "#14213D",
          },
          secondary: {
            main: "#fafafa",
          },
          text: {
            primary: "#fff",
          },
        },
      })
    ),
    previewColor: "rgba(20, 33, 61, 1)",
    previewTextColor: "#e6af4b",
    transition: { backgroundColor: "#14213D" },
  },
  "/projects": {
    name: "Projects",
    theme: createTheme(
      adaptV4Theme({
        palette: {
          primary: {
            main: "#14213D",
          },
          secondary: {
            main: "#fafafa",
          },
          text: {
            primary: "#fff",
          },
        },
      })
    ),
    previewColor: "#018786",
    previewTextColor: "#e6af4b",
    transition: { backgroundColor: "#018786" },
  },
  "/blog": {
    name: "Blog",
    theme: createTheme(
      adaptV4Theme({
        palette: {
          primary: {
            main: "#14213D",
          },
          secondary: {
            main: "#fafafa",
          },
          text: {
            primary: "#fff",
          },
        },
      })
    ),
    previewColor: "#14213D",
    previewTextColor: "#e6af4b",
    transition: { backgroundColor: "#14213D" },
  },
  "/_error": {
    name: "/_error",
    theme: createTheme(adaptV4Theme({})),
  },
  "/404": {
    name: "/404",
    theme: createTheme(adaptV4Theme({})),
  },
  "/504": {
    name: "/504",
    theme: createTheme(adaptV4Theme({})),
  },
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
  const pathname = `/${router.pathname.split("/")[1]}`;
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  console.log(Component);
  return (
    <div>
      <Head>
        <title>Michael Fortunato</title>
        <meta name="description" content="Michael Fortunato Website" />
        <link rel="icon" href="" />
      </Head>
      <main ref={mainRef}>
        <div>
          <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={routes[pathname].theme}>
              <StyledComponentsThemeProvider theme={routes[pathname].theme}>
                <SWRConfig
                  value={{
                    fetcher: (url) => axios.get(url).then((res) => res.data),
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
                          duration: 0.3,
                        },
                      }}
                    >
                      <Component key={pathname} {...pageProps} />
                    </StyledRoot>
                  </AnimatePresence>
                </SWRConfig>
              </StyledComponentsThemeProvider>
            </MuiThemeProvider>
          </StyledEngineProvider>
        </div>
      </main>
    </div>
  );
}
