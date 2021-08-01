import '../styles/globals.css'

import React, { useState, useEffect } from 'react'


//import Navbar from '@components/Nav/Navbar.js'
//import Home from './Home'
//import About from './About'
import { createMuiTheme, StylesProvider } from "@material-ui/core/styles"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components"
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import Head from "next/head"
import styled from 'styled-components'
import Navbar from '@components/Nav/Navbar'
import Link from "next/link"
const StyledRoot = styled(motion.div)`
  overflow: hidden: 
  width: 100vw;
  height: 100vh;
  background-color: #e6af4b;
`
/*
const routes = [
  { path: '/about', name: 'About', aniName: 'about', aniEnterTime: 6000, aniExitTime: 3000, Component: About },
  { path: '/', name: 'Home', aniName: 'home', aniEnterTime: 3000, aniExitTime: 6000, Component: Home }
]
*/

const routeTransitions = {
  "/": {backgroundColor: "#e6af4b"}, 
  "/about": {backgroundColor: "#14213D"}
}
export default function App({ Component, pageProps }) {
  const [initialVisits, setInitialVisits] = useState({ "/": false, "about": false, "/apps": false, "/blog": false })
  const [prevLocation, setPrevLocation] = useState(null);
  const [hasEntered, setHasEntered] = useState(true)
  const router = useRouter()
  const pathname = router.pathname

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    if (pathname != prevLocation) {
      setPrevLocation(pathname)
    }
  })
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
            <Navbar location = {pathname}/> 
            <AnimatePresence initial = {false}>
            <StyledRoot animate = {routeTransitions[pathname]}>
              <AnimatePresence exitBeforeEnter>
                <Component key={pathname}
                  {...pageProps} />
              </AnimatePresence>
            </StyledRoot>
            </AnimatePresence>
          </StylesProvider>
        </div>
      </main>
    </div>
  )
}