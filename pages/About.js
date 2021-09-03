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
import { Element, Events, scroller } from "react-scroll"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import ScrollLock, { TouchScrollable } from 'react-scrolllock';
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
/*

const useScrollListener = (element, handleScroll, throttle = 5000) => {
    const scrollingTimer = React.useRef();
    const [scrollX, setScrollX] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const prevScrollX = useRef(0);
    const prevScrollY = useRef(0);
    const handleScroll = (e) => {
        prevScrollX.current  = scrollX;
        prevScrollY.current = scrollY;
        setScrollX(document.body.pageYOffset);
        setScrollY(document.body.pageYOffset);
        return {x: scrollX, y: scrollY, prevX: prevScrollX.current, prevY: scrollY.current}
    }
    const listenToScroll = React.useCallback(
        (e) => {
            element.current?.removeEventListener('scroll', listenToScroll); // unregister the event
            clearTimeout(scrollingTimer.current); // clear previous timeout instance
            scrollingTimer.current = setTimeout(
                () => element.current?.addEventListener('scroll', listenToScroll), // re-register the event after a certain time
                throttle
            );
            return handleScroll(e); // call the handler logic (this is asyncchronous and will not wait for the setTimeout to run!) 
        },
        [throttle, element, handleScroll]
    );

    React.useEffect(() => {
        const currentElement = element.current;
        if (currentElement) {
            currentElement.addEventListener('scroll', listenToScroll);
        }
        return () => {
            currentElement?.removeEventListener('scroll', listenToScroll);
            clearTimeout(scrollingTimer.current);
        };
    }, [listenToScroll, element]);
};*/
export default function About(props) {
    const lottieRef = useRef(null);
    const secondPageRef = useRef(null);
    const [hasScrolledDown, setHasScrolledDown] = useState(false);
    const [releaseScroll, setReleaseScroll] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isXL, setIsXL] = useState(false)
    const [hasMounted, setHasMounted] = useState(false);
    const [triggerTlIntro, setTriggerTlIntro] = useState(false);
    const [triggerAniRef, isAniInView] = useInView({ initialInView: true });
    const scrollTimer = useRef(null);
    const About2Ref = useRef(null);

    const [scrollStarted, setScrollStarted] = useState(false);
    useScrollPosition(({ prevPos, currPos }) => {
        //if (!hasScrolledDown && (prevPos.y > currPos.y)) { setHasScrolledDown(true) }
    })

    /*
    useEffect(() => {
        if (hasScrolledDown) {
            scroller.scrollTo("myScrollToElement", {
                duration: 1000,
                delay: 0,
                smooth: true,
                spyThrottle: 0
            })
        }
    }, [hasScrolledDown])*/

    useEffect(() => {
        if (hasMounted) {
            if (isAniInView) lottieRef.current.play()
            //if (!isAniInView) lottieRef.current.pause()

        }
    }, [isAniInView])

    useEffect(() => {
        // Set a timer that delays the animation
        setTimeout(() => {
            lottieRef.current.playSegments([[0, 693], [693, 883]], true)
        }, 500);
        setTimeout(() => scroller.scrollTo("myScrollToElement", {
            duration: 1000,
            delay: 0,
            smooth: true,
            spyThrottle: 0,
            ignoreCancelEvents: true
        }), 5200);
        if (window.matchMedia('(min-width: 3000px)').matches) {
            setIsXL(true)
        }
    }, [])
    useEffect(() => {
        Events.scrollEvent.register('end', (to, element) => {
            setTriggerTlIntro(true);
        })
    }, [])
    /*
    useEffect(() => {
        //document.body.style.overflowY = "scroll";
        Events.scrollEvent.register('end', (to, element) => {
            const viewportOffset = element.getBoundingClientRect()
            clearTimeout(scrollTimer.current)
            if (viewportOffset.top !== 0) {
                scrollTimer.current = setTimeout(() => scroller.scrollTo("myScrollToElement", {
                    duration: 1000,
                    delay: 0,
                    smooth: true,
                    spyThrottle: 0
                }), 400)
            } else {
                setReleaseScroll(false)
                setTriggerTlIntro(true);
            }
        })
    }, [])
    */

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
            <Element name="myScrollToElement">
                <ScrollLock isActive={!releaseScroll} />
                {<About2 triggerTlIntro={triggerTlIntro} setReleaseScroll={setReleaseScroll} key={2} />}
            </Element>
        </AboutRoot >

    );
}