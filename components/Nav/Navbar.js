import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from "react-dom";
import styled from 'styled-components'
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { AnimatePresence, motion } from "framer-motion"
import { Twirl as Hamburger } from "hamburger-react";
import Divider from "@material-ui/core/Divider"
import useTheme from "@material-ui/core/styles/useTheme"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withTheme } from '@material-ui/core';
import { gsap } from "gsap";

const StyledNavbar = styled(Grid)`
    ${({ theme }) => `color: #fff;`}
    padding: 1.5rem;
    position: fixed;
    z-index: 10000;
`;

const Underline = styled(Divider)`
    height: 2px;
    background-color: white;
`
const MotionGrid = motion(Grid);
const MotionTypography = motion(Typography);

export default function Navbar(props) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(null);
    const underlineAnimations = {
        "activePage": {
            scaleX: 1,
        },
        "inactivePage": {
            scaleX: 0
        }
    };
    useEffect(() => {
    }, [])
    return (
        <StyledNavContainer>
            <NavPage routes={props.routes} isVisible={isVisible} setIsVisible={setIsVisible} />
            <StyledNavbar container>
                <Grid item xs={1}>
                    <Hamburger duration={0.2} toggled={isVisible} toggle={() => setIsVisible(!isVisible)} />
                </Grid>
            </StyledNavbar>
        </StyledNavContainer>
    );
}
const StyledNavContainer = styled.div`
    position: fixed; 
    z-index: 100000;
`;

const StyledNavPage = styled(motion.div)`
    position: relative; 
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color:#49474D;
    //background-color: rgb(0,0,0); /* Black fallback color */
    //background-color: rgba(0,0,0, 0.9); /* Black w/opacity */
`

const StyledDesktopNav = styled.div`
width: 30%;

`
const StyledTypography = styled(motion(Typography))`
`

const StyledCloseButton = styled.div`
    position: absolute;
    right: 5%;
    top: 5%;
    cursor: pointer;
`
const StyledCircle = styled(motion.ellipse)`
    fill:none;
    stroke:#fff;
    stroke-width:4;
`
const StyledLine = styled.line`
    fill:none;
    stroke:#fff;
    stroke-width:6;
    stroke-miterlimit:10;
`
const CloseButton = (props) => {
    const circleRef = useRef(null);
    const leftLineRef = useRef(null);
    const rightLineRef = useRef(null);
    const tl = useRef(null);
    useEffect(() => {
		const circleLength = circleRef.current.getTotalLength();
		const lineLength = leftLineRef.current.getTotalLength();
        tl.current = gsap.timeline()
        .fromTo(leftLineRef.current, { strokeDasharray: lineLength, strokeDashoffset: lineLength }, {strokeDashoffset:0}, "<.5")
        .fromTo(rightLineRef.current, { strokeDasharray: lineLength, strokeDashoffset: lineLength }, {strokeDashoffset:0}, "<.2")
        .fromTo(circleRef.current, { strokeDasharray: circleLength, strokeDashoffset: circleLength }, {strokeDashoffset:0}, "<.2")
    }, [])
    return (
        <StyledCloseButton onClick={() => props.setIsVisible(false)}>
            <svg version="1.1" id="Layer_1"
                width="80px"
                height="100px"
                viewBox="-10 0 201 201">
                <StyledCircle ref={circleRef} cx="91" cy="91" rx="91" ry="91" />
                <StyledLine ref = {leftLineRef} x1="56.1" y1="125.6" x2="126.8" y2="54.9" />
                <StyledLine ref = {rightLineRef} x1="56.2" y1="54.8" x2="126.8" y2="125.5" />
            </svg>
        </StyledCloseButton>
    )
}
const DesktopNav = (props) => {
    const desktopRef = useRef(null);
    const linksQuery = gsap.utils.selector(desktopRef);
    useEffect(() => {
        const links = linksQuery(".links");
        gsap.fromTo(links, {x: -200, y: -200, rotation: 30}, {x: 0, y:0, rotation: 0, stagger:.2})
    }, [])
    return (
        <Grid ref={desktopRef} container style={{ height: "100%" }}>
            <Grid item xs={4} container direction="column" justifyContent="center" alignItems="center" style={{ height: "100%" }} spacing={4}>
                {Object.entries(props.routes).map(([url, { name }]) =>
                    <Grid className="links" key={url} item>
                        <motion.div
                            animate={{
                                color: props.previewUrl !== null ? props.routes[props.previewUrl].previewTextColor : "#FFFFFF",
                            }}
                            transition={{ color: { duration: 1 } }}
                            onMouseOver={() => props.setPreviewUrl(url)}
                            onMouseLeave={() => props.setPreviewUrl(null)}
                            onClick={() => props.setIsVisible(false)}
                            style={{ display: "inline-block" }}>
                            <Link href={url}>
                                <a>
                                    <StyledTypography animate={{
                                        scale: (url === props.previewUrl) ? 1 : 1,
                                        translateX: (url === props.previewUrl) ? "10px" : 0,
                                        translateY: (url === props.previewUrl) ? "-10px" : 0,
                                    }}
                                        variant="h2">{name}</StyledTypography>
                                </a>
                            </Link>
                            <AnimatePresence initial={false}>
                                <motion.div
                                    style={{ transformOrigin: "50%" }}
                                    animate={{
                                        scaleX: (url === props.previewUrl) ? 1.1 : 0,
                                    }}
                                    >
                                    <Underline />
                                </motion.div>
                            </AnimatePresence></motion.div></Grid>)}
            </Grid>
            <Grid item xs={8} >
                <StyledTypography></StyledTypography>
            </Grid>
        </Grid >
    )
}
const NavPage = (props) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    console.log(props.routes[previewUrl])
    return (
        <AnimatePresence initial={false}>
            {props.isVisible &&
                <StyledNavPage
                    style={{ originY: 0 }}
                    initial={{ translateY: "-100%" }}
                    animate={{
                        backgroundColor: previewUrl !== null ? props.routes[previewUrl].previewColor : "#49474D",
                        translateY: 0,
                        transition: { duration: .5 }
                    }}
                    exit={{ scaleY: 0, transition: { duration: .5 } }}
                >
                    <NavContent routes={props.routes} setIsVisible={props.setIsVisible} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
                    <CloseButton setIsVisible={props.setIsVisible} />
                </StyledNavPage>}
        </AnimatePresence>);
}
const NavContent = (props) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (<>
        {isDesktop ? <DesktopNav routes={props.routes} setIsVisible={props.setIsVisible} previewUrl={props.previewUrl} setPreviewUrl={props.setPreviewUrl} /> : null}
    </>)
}
/*
class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isVisible: false }
        this.setIsVisible = this.setIsVisible.bind(this);
    }
    setIsVisible() {
        this.setState((state) => ({ isVisible: !state.isVisible }))
    }
    render() {
        console.log(`Is Open: ${this.state.isVisible}`)
        let styleConfig = NavConfiguration[this.props.location];
        return (
            <StyledNavbar>
                <Navbutton isVisible={this.state.isVisible} setIsVisible={this.setIsVisible} styleConfig={styleConfig} />
                <NavContent isVisible={this.state.isVisible} setIsVisible={this.setIsVisible} styleConfig={styleConfig} />
            </StyledNavbar>
        );
    }
}
export default Navbar;
*/