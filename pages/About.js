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
import { Divider } from '@material-ui/core'


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

        try {
            if (window.matchMedia('(min-width: 3000px)').matches) {
                setIsXL(true)
            }
        } catch (ex) { }
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
                                <Typography variant="h3">Scroll down</Typography>
                            </Grid>
                        </motion.div>
                        //<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1774.455 2365.94 2162.15"></svg>
                    }
                </PageFooter>
            </StyledPage>
            <StyledPage ref={secondPageRef} key={2}>
                <div style={{ position: "absolute" }}>
                    <Paper >
                        <Grid container style = {{width : '20vw'}} justify="center" spacing = {2}>
                            <Grid item xs={12} >
                                <BlackTypography variant = {"h4"}>
                                    Beginnings 
                                </BlackTypography>
                                <Divider />
                            </Grid>
                            <Grid item xs = {10}>
                                <BlackTypography>
                                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sagittis odio quam, eu cursus orci ullamcorper eget. Vestibulum justo tortor, posuere sed ullamcorper non, molestie condimentum libero. Praesent nulla erat, consequat eu lacus non, egestas dignissim lorem. Vivamus sollicitudin, lorem eget consequat commodo, quam diam vehicula ipsum, ut euismod augue lorem lobortis dui. Nullam semper mattis leo. Phasellus porttitor sodales mauris, eu vehicula odio ullamcorper a. Suspendisse ex ante, scelerisque non luctus eget, dignissim at justo. Integer a diam nulla. Phasellus fermentum odio eu enim ultrices, rutrum lacinia ex pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare gravida mollis. Nullam sit amet vulputate tortor. Nulla non nisl eu tellus placerat lobortis. Sed at ligula ut ligula ullamcorper consectetur. Phasellus ultrices justo eu neque sagittis, quis vehicula sem ullamcorper. 
                                </BlackTypography>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
                <div>
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox={`-${1 / 6 * 2365.95} 0 ${1.25 * 2365.94} ${1 * 2162.15}`} preserveAspectRatio="none">
                        <defs>
                        </defs>
                        <path id="RedLine" class="cls-1" d="M1790.66-.15V101.68l-43.19,43.19,0,4.13,0,659.92,97,224.58V2162" transform="translate(-673 0.15)" />
                        <g id="_1" data-name="1">
                            <path id="circle11956" class="cls-2" d="M1764,181a17,17,0,1,1-17-17A17,17,0,0,1,1764,181Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1074.98 181.12 804.5 183.65 648.5 295.65 297.38 292.28" />
                                <path class="cls-4" d="M904,291.5c31.35-11.29,70.29-30.7,94.52-51.41L979.1,292.22l18.42,52.48C973.69,323.53,935.13,303.38,904,291.5Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_2" data-name="2">
                            <path id="circle11956-2" data-name="circle11956" class="cls-2" d="M1761.47,356.41c13.87,18.22-6.72,38.81-24.94,24.94C1722.66,363.13,1743.25,342.53,1761.47,356.41Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1074.32 369.4 1357.5 191.65 1782.62 195.11" />
                                <path class="cls-4" d="M2522,195.5c-31.33,11.34-70.25,30.8-94.44,51.55l19.34-52.16-18.49-52.46C2452.26,163.57,2490.86,183.67,2522,195.5Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_3" data-name="3">
                            <path id="circle11956-3" data-name="circle11956" class="cls-2" d="M1765,557.57a17,17,0,1,1-17-17A17,17,0,0,1,1765,557.57Z" transform="translate(-673 0.15)" />
                            <g>
                                <path class="cls-3" d="M1747,557.37,1614.5,469.78a43.24,43.24,0,0,0-24.19-7.19l-279.21,1.83a56,56,0,0,0-24,5.54l-166.67,80.1a70.4,70.4,0,0,1-30.52,7H791.39" transform="translate(-673 0.15)" />
                                <path class="cls-4" d="M725,557c31.24-11.6,70-31.37,94-52.32L800.1,557,819,609.32C795,588.37,756.24,568.6,725,557Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_5" data-name="5">
                            <path id="circle11956-4" data-name="circle11956" class="cls-2" d="M1815.48,917.79a17,17,0,1,1-17-17A17,17,0,0,1,1815.48,917.79Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1122.68 917.89 839.5 1095.65 414.38 1092.19" />
                                <path class="cls-4" d="M1021,1091.5c31.33-11.34,70.25-30.8,94.44-51.55l-19.34,52.16,18.49,52.46C1090.74,1123.43,1052.14,1103.33,1021,1091.5Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_4" data-name="4">
                            <path id="circle11956-5" data-name="circle11956" class="cls-2" d="M1764.4,730.32a17,17,0,1,1-17-17A17,17,0,0,1,1764.4,730.32Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1074.32 731.4 1542 738.15 1679.5 557.65 2201.61 557.65" />
                                <path class="cls-4" d="M2941,557.5c-31.24,11.59-70,31.37-94,52.31l18.92-52.31L2847,505.2C2871,526.14,2909.76,545.92,2941,557.5Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_6" data-name="6">
                            <path id="circle11956-6" data-name="circle11956" class="cls-2" d="M1861.9,1097.15a17,17,0,1,1-17-17A17,17,0,0,1,1861.9,1097.15Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1172.27 1097 1639.94 1103.75 1777.44 923.25 2299.56 923.25" />
                                <path class="cls-4" d="M3038.94,923.1c-31.23,11.59-70,31.37-94,52.32l18.92-52.32-18.92-52.3C2969,891.75,3007.71,911.52,3038.94,923.1Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_7" data-name="7">
                            <path id="circle11956-7" data-name="circle11956" class="cls-2" d="M1861.4,1314.18a17,17,0,1,1-17-17A17,17,0,0,1,1861.4,1314.18Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1172.54 1314.72 902.06 1312.19 746.06 1200.19 394.94 1203.56" />
                                <path class="cls-4" d="M1001.56,1204c31.13-11.89,69.69-32,93.52-53.21l-18.43,52.49,19.43,52.12C1071.85,1234.73,1032.91,1215.32,1001.56,1204Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_8" data-name="8">
                            <path id="circle11956-8" data-name="circle11956" class="cls-2" d="M1861.9,1530.46a17,17,0,1,1-17-17A17,17,0,0,1,1861.9,1530.46Z" transform="translate(-673 0.15)" />
                            <g>
                                <path class="cls-3" d="M1845.19,1530.19l132.48-87.6a43.31,43.31,0,0,1,24.19-7.18l279.21,1.83a56,56,0,0,1,24,5.54l166.67,80.1a70.46,70.46,0,0,0,30.53,6.95h298.56" transform="translate(-673 0.15)" />
                                <path class="cls-4" d="M2867.17,1529.83c-31.23,11.6-70,31.37-94,52.32l18.92-52.32-18.92-52.3C2797.18,1498.48,2835.94,1518.25,2867.17,1529.83Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_9" data-name="9">
                            <path id="circle11956-9" data-name="circle11956" class="cls-2" d="M1861.9,1779.46a17,17,0,1,1-17-17A17,17,0,0,1,1861.9,1779.46Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1171 1779.31 1441.48 1781.84 1597.48 1893.84 1948.6 1890.48" />
                                <path class="cls-4" d="M2688,1889.69c-31.12,11.89-69.69,32-93.51,53.22l18.42-52.5-19.43-52.12C2617.69,1859,2656.64,1878.41,2688,1889.69Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                        <g id="_10" data-name="10">
                            <path id="circle11956-10" data-name="circle11956" class="cls-2" d="M1857.21,1978c13.87,18.21-6.72,38.81-24.94,24.93C1818.4,1984.73,1839,1964.13,1857.21,1978Z" transform="translate(-673 0.15)" />
                            <g>
                                <polyline class="cls-3" points="1172.37 1992.77 810.93 1991.08 623.5 1702.65 66.39 1702.65" />
                                <path class="cls-4" d="M673,1702.5c31.24-11.59,70-31.37,94-52.31L748.1,1702.5,767,1754.8C743,1733.86,704.24,1714.08,673,1702.5Z" transform="translate(-673 0.15)" />
                            </g>
                        </g>
                    </svg>
                </div>
            </StyledPage>
            <StyledPage key={3} />
        </AboutRoot>

    );
}