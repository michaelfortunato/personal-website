import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRef } from "lottie-react";
import animationData from "@public/About_Page1_ISA-Loop.json";
import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import About2 from "@components/About/About2";
import { assetsURL } from "@utils/configurations";
// import fs from "fs";

const AboutRoot = styled(motion.div)`
	width: 100%;
	overflow-x: hidden;
`;
const StyledPage = styled(motion.div)`
	width: 100vw;
	overflow-x: hidden;
	height: 100vh;
	position: relative;
`;
const TitleContainer = styled.div`
	position: absolute;
	top: 50%;
	text-align: center;
	width: 100%;
	color: #fff;
`;
const PageFooter = styled(Grid)`
	position: absolute;
	top: 85vh;
	color: white;
`;

const BlackTypography = styled(Typography)`
	color: black;
`;

export default function About() {
	const lottieRef = useRef(null) as LottieRef;
	const secondPageRef = useRef(null);
	const [isXL, setIsXL] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);
	const [triggerAniRef, isAniInView] = useInView({ initialInView: true });
	// What are these below?
	const [lastScrollY, setLastScrollY] = useState(0);
	const [triggerTlIntro, setTriggerTlIntro] = useState(false);
	const scrollTimer = useRef(null);
	const About2Ref = useRef(null);

	const [scrollStarted, setScrollStarted] = useState(false);

	useEffect(() => {
		if (hasMounted && lottieRef.current) {
			if (isAniInView) lottieRef.current.play();
		}
	}, [isAniInView]);

	useEffect(() => {
		// Set a timer that delays the animation
		setTimeout(() => {
			// Make sure reference is valid
			if (!lottieRef.current) return;

			lottieRef.current.playSegments(
				[
					[0, 693],
					[693, 883]
				],
				true
			);
		}, 500);
		if (window.matchMedia("(min-width: 3000px)").matches) {
			setIsXL(true);
		}
	}, []);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<AboutRoot
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { duration: 0.3 } }}
			exit={{ opacity: 0, transition: { delay: 0.6, duration: 0.3 } }}
		>
			<StyledPage key={1}>
				<Lottie
					lottieRef={lottieRef}
					style={!isXL ? { height: "100vh" } : {}}
					loop
					autoplay={false}
					animationData={animationData}
				/>
				<div
					ref={triggerAniRef}
					style={{
						opacity: 0,
						position: "absolute",
						left: "50%",
						top: "20%"
					}}
				/>
			</StyledPage>
			{/* <About2 blurbs={props.blurbs} triggerTlIntro={triggerTlIntro} key={2} /> */}
		</AboutRoot>
	);
}
