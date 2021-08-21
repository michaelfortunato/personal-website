import React, { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import animationData from '@public/NYC_ARROW.json'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { motion } from "framer-motion"
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'

import About2 from '@components/About/About2'

const AboutRoot = styled(motion.div)`
    height: 100%;
    width: 100%;
    overflow-x: hidden;
`
const StyledPage = styled(motion.div)`
    width: 100vw;
    overflow-x: hidden;
    min-height: 100vh;
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
    const [isSubwayDone, setIsSubwayDone] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const theme = useTheme();
    const [isXL, setIsXL] = useState(false)

    useEffect(() => {
        // Set a timer that delays the animation
        setTimeout(() => {
            lottieRef.current.play()
        }, 500);

        try {
            if (window.matchMedia('(min-width: 3000px)').matches) {
                setIsXL(true)
            }
        } catch (ex) { }

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
                    loop={false}
                    autoplay={false}
                    animationData={animationData}
                />
            </StyledPage>
            <About2 />
        </AboutRoot >

    );
}