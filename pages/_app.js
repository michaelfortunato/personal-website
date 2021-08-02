import '../styles/globals.css'

import React, { useState, useEffect } from 'react'

import { createTheme, StylesProvider } from "@material-ui/core/styles"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components"
import { useRouter } from 'next/router'
import "@fontsource/roboto"
import { AnimatePresence, motion } from 'framer-motion'
import Head from "next/head"
import styled from 'styled-components'
import Navbar from '@components/Nav/Navbar'
const StyledRoot = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  background-color: #e6af4b;
`

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
        }, 
      },
    }),
    transition: { backgroundColor: "#e6af4b" }
  },
  "/about": {
    name: "About",
    theme: createTheme({
      palette: {
        primary: {
          main: "#14213D",
        },
        secondary: {
          main: "#fafafa"
        },
        text: {
          primary: "#fff"
        },
      },
    }),
    transition: { backgroundColor: "#14213D" }, 
  }, 
}
export default function App({ Component, pageProps, router }) {
  const pathname = router.pathname

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Michael Fortunato</title>
        <meta name="description" content="Michael Fortunato Website" />
        <link rel="icon" href="" />
      </Head>
      <main>
        <div>
          <StylesProvider injectFirst>
            <MuiThemeProvider theme={pathname !== "/_error" && routes[pathname].theme}>
              <StyledComponentsThemeProvider theme={pathname !== "/_error" && routes[pathname].theme}>
                <Navbar routes={routes} currentPage={pathname} />
                <AnimatePresence initial={false}>
                  <StyledRoot animate={pathname !== "/_error" && routes[pathname].transition}>
                    <AnimatePresence exitBeforeEnter>
                      <Component key={pathname}
                        {...pageProps} />
                    </AnimatePresence>
                  </StyledRoot>
                </AnimatePresence>
              </StyledComponentsThemeProvider>
            </MuiThemeProvider>
          </StylesProvider>
        </div>
      </main>
    </div>
  )
}