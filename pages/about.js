import React, { useCallback, useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import animationData from "@public/About_Page1_ISA-Loop.json";
import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { useInView } from "react-intersection-observer";
import About2 from "@components/About/About2";
import { assetsURL } from "@utils/configurations";
// import fs from "fs";
import matter from "gray-matter";
import path from "path";
import axios from "axios";
import parser from "fast-xml-parser";

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

export default function About(props) {
	const lottieRef = useRef(null);
	const secondPageRef = useRef(null);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isXL, setIsXL] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);
	const [triggerTlIntro, setTriggerTlIntro] = useState(false);
	const [triggerAniRef, isAniInView] = useInView({ initialInView: true });
	const scrollTimer = useRef(null);
	const About2Ref = useRef(null);

	const [scrollStarted, setScrollStarted] = useState(false);

	useEffect(() => {
		if (hasMounted) {
			if (isAniInView) lottieRef.current.play();
			// if (!isAniInView) lottieRef.current.pause()
		}
	}, [isAniInView]);

	useEffect(() => {
		// Set a timer that delays the animation
		setTimeout(() => {
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
					style={!isXL ? { height: "100vh" } : null}
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

const loadFilesFromS3Directory = async prefix => {
	const { data } = await axios.get(`${assetsURL}/`, {
		params: {
			"list-type": 2,
			prefix,
			delimiter: "/",
			Bucket: "assets.michaelfortunato.org"
		}
	});
	const {
		ListBucketResult: { Contents: unNormalizedContents }
	} = parser.parse(data);
	const Contents = !Array.isArray(unNormalizedContents)
		? [unNormalizedContents]
		: unNormalizedContents;

	const promises = Contents.map(({ Key }) => axios.get(`${assetsURL}/${Key}`));
	return Promise.all(promises);
};
