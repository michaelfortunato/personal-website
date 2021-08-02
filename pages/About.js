import React, { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import animationData from '@public/NYC_ARROW.json'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { motion } from "framer-motion"
import { useTheme } from '@material-ui/core/styles'


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
    left: -40px;
    color: white;
`
export default function About(props) {
    const lottieRef = useRef(null);
    const secondPageRef = useRef(null);
    const [isSubwayDone, setIsSubwayDone] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const theme = useTheme();


    const handleScroll = (e) => {
        console.log(secondPageRef.current.getBoundingClientRect());
        if (isSubwayDone && (e.srcElement.scrollTop > lastScrollY)) {
            /* 
                Trigger second animation here
            */

        }
        setLastScrollY(e.srcElement.scrollTop);
    }
    useEffect(() => {
        setLastScrollY(document.body.scrollTop)
        document.body.addEventListener("scroll", handleScroll);
        document.body.addEventListener("wheel", handleScroll);
        // Set a timer that delays the animation
        setTimeout(() => {
            lottieRef.current.play()
        }, 500);
        return () => {
            document.body.removeEventListener('scroll', handleScroll);
            document.body.removeEventListener("wheel", handleScroll);
        };
    }, [])
    return (
        <AboutRoot
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            hiddenProp={isSubwayDone ? "none" : "hidden"}
        >
            <StyledPage key={1}>
                <Lottie lottieRef={lottieRef}
                    loop={false}
                    autoplay={false}
                    animationData={animationData}
                    onComplete={() => setIsSubwayDone(true)}
                />
                <PageFooter container justifyContent="center">
                    {isSubwayDone &&
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Grid item>
                                <Typography variant="button" style={{ fontSize: "2rem" }}>Scroll down</Typography>
                            </Grid>
                        </motion.div>
                    }
                </PageFooter>
            </StyledPage>
            <StyledPage ref = {secondPageRef} key={2} /> 
        </AboutRoot>

    );
}