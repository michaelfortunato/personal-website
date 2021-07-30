import '../styles/globals.css'

import React, { useState, useEffect } from 'react'


//import Navbar from '@components/Nav/Navbar.js'
//import Home from './Home'
//import About from './About'
import { StylesProvider } from "@material-ui/core/styles"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components"
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import { CSSTransition } from 'react-transition-group'
/*
const routes = [
  { path: '/about', name: 'About', aniName: 'about', aniEnterTime: 6000, aniExitTime: 3000, Component: About },
  { path: '/', name: 'Home', aniName: 'home', aniEnterTime: 3000, aniExitTime: 6000, Component: Home }
]
*/
function MyApp({ Component, pageProps }) {
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
  console.log(pageProps)
  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={{}}>
        <StyledComponentsThemeProvider theme={{}}>
          <AnimatePresence exitBeforeEnter>
            <Component key={pathname} {...pageProps} />
          </AnimatePresence>
        </StyledComponentsThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>)
}

export default MyApp;
/*
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialVisits: {
        '/': false,
        '/about': false,
        '/apps': false,
        '/blog': false
      },
      prevLocation: null,
      hasEntered: true
    }
    this.setVisited = this.setVisited.bind(this)
    this.setEntered = this.setEntered.bind(this)
  }
  setVisited(path) {
    if (this.state.initialVisits[path] == false) {
      this.setState({ initialVisits: { [path]: true } })
    }
  }
  setEntered(bool) {
    this.setState({ hasEntered: bool })
  }
  componentDidUpdate() {
    if (this.props.location.pathname != this.state.prevLocation) {
      this.setState({ prevLocation: this.props.location.pathname })
    }
  }
  render() {
    return (
      <div>
        <Navbar location={this.props.location.pathname} />
        {routes.map(({ path, aniName, aniEnterTime, aniExitTime, Component }) => (
          <Route key={path}>
            <CSSTransition
              classNames={aniName}
              in={this.props.location.pathname == path}
              timeout={
                {
                  enter: aniEnterTime,
                  exit: aniExitTime
                }
              }
              onEnter={() => this.setEntered(false)}
              onEntered={() => this.setEntered(true)}
              unmountOnExit={true}
            >
              <Component location={this.props.location.pathname} hasEntered={this.state.hasEntered} />
            </CSSTransition>
          </Route>
        ))}
      </div>
    );
  }
}

export default App
*/