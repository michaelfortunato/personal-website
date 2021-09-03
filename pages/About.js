import React, { useCallback, useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import animationData from '@public/About_Page1_ISA-Loop.json'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { motion } from "framer-motion"
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import { useInView } from "react-intersection-observer";
import About2 from '@components/About/About2'

const AboutRoot = styled(motion.div)`
    width: 100%;
    overflow-x: hidden;
`
const StyledPage = styled(motion.div)`
    width: 100vw;
    overflow-x: hidden;
    height: 100vh;
    position: relative;
`
const TitleContainer = styled.div`
    position: absolute; 
    top: 50%;
    text-align: center;
    width: 100%;
    color: #fff;
`
const PageFooter = styled(Grid)`
    position: absolute;
    top: 85vh;
    color: white;
`

const BlackTypography = styled(Typography)`
    color: black;
`
export default function About(props) {
    const lottieRef = useRef(null);
    const secondPageRef = useRef(null);
    const [hasScrolledDown, setHasScrolledDown] = useState(false);
    const [releaseScroll, setReleaseScroll] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const theme = useTheme();
    const [isXL, setIsXL] = useState(false)
    const [hasMounted, setHasMounted] = useState(false);
    const [triggerAniRef, isAniInView] = useInView({initialInView: true});
    useEffect(() => {
        if(hasMounted) {
            if (isAniInView) lottieRef.current.play()
            if (!isAniInView) lottieRef.current.pause()

        }
    }, [isAniInView])

    useEffect(() => {
        // Set a timer that delays the animation
        setTimeout(() => {
            lottieRef.current.playSegments([[0, 693], [693, 883]], true)
        }, 500);
        setTimeout(() => {
            setReleaseScroll(true)
        }, 4000);
        if (window.matchMedia('(min-width: 3000px)').matches) {
            setIsXL(true)
        }
    }, [])
    useEffect(() => {
        document.body.style.overflowY = "scroll";
    }, [])

    useEffect(() => {
        setHasMounted(true);
    }, [])


    return (
        <AboutRoot
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <StyledPage key={1}>
                <Lottie lottieRef={lottieRef}
                    style={!isXL ? { height: "100vh" } : null}
                    loop={true}
                    autoplay={false}
                    animationData={animationData}
                />
                <div ref={triggerAniRef} style={{ opacity: 0, position: "absolute", "left": "50%", top: "20%" }} />
            </StyledPage>
            {releaseScroll && <About2 key={2} />}
        </AboutRoot >

    );
}