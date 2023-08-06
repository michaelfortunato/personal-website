import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { Twirl as Hamburger } from "hamburger-react";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { gsap } from "gsap";

const StyledNavbar = styled.div`
	${({ theme }) => `color: #fff;`}
	padding: 1.5rem;
	position: fixed;
	z-index: 1;
	display: inline-block;
`;

const Underline = styled(Divider)`
	height: 2px;
	background-color: white;
`;
const MotionGrid = motion(Grid);
const MotionTypography = motion(Typography);

export default function Navbar(props) {
	const [isVisible, setIsVisible] = useState(false);
	const [isHovered, setIsHovered] = useState(null);
	const underlineAnimations = {
		activePage: {
			scaleX: 1
		},
		inactivePage: {
			scaleX: 0
		}
	};
	useEffect(() => {}, []);
	return (
		<StyledNavContainer>
			<StyledNavbar container>
				<div>
					<Hamburger
						duration={0.2}
						toggled={isVisible}
						toggle={() => setIsVisible(!isVisible)}
					/>
				</div>
			</StyledNavbar>
			<NavPage
				routes={props.routes}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
			/>
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
	background-color: #49474d;
	//background-color: rgb(0,0,0); /* Black fallback color */
	//background-color: rgba(0,0,0, 0.9); /* Black w/opacity */
`;

const StyledDesktopNav = styled.div`
	width: 30%;
`;
const StyledTypography = styled(motion(Typography))``;

const StyledCloseButton = styled.div`
	position: absolute;
	right: 5%;
	top: 5%;
	cursor: pointer;
`;
const StyledCircle = styled(motion.ellipse)`
	fill: none;
	stroke: #fff;
	stroke-width: 4;
`;
const StyledLine = styled.line`
	fill: none;
	stroke: #fff;
	stroke-width: 6;
	stroke-miterlimit: 10;
`;
const CloseButton = props => {
	const circleRef = useRef(null);
	const leftLineRef = useRef(null);
	const rightLineRef = useRef(null);
	const tl = useRef(null);
	const [mouseOver, setMouseOver] = useState(null);
	const [mouseDown, setMouseDown] = useState(null);
	useEffect(() => {
		const circleLength = circleRef.current.getTotalLength();
		const lineLength = leftLineRef.current.getTotalLength();
		tl.current = gsap
			.timeline()
			.fromTo(
				leftLineRef.current,
				{ strokeDasharray: lineLength, strokeDashoffset: lineLength },
				{ strokeDashoffset: 0, duration: 0.2 },
				"<1.1"
			)
			.fromTo(
				rightLineRef.current,
				{ strokeDasharray: lineLength, strokeDashoffset: lineLength },
				{ strokeDashoffset: 0, duration: 0.2 },
				"<.2"
			)
			.fromTo(
				circleRef.current,
				{ strokeDasharray: circleLength, strokeDashoffset: circleLength },
				{ strokeDashoffset: 0 },
				"<.4"
			);
	}, []);
	useEffect(() => {
		if (mouseDown) {
			gsap.to(leftLineRef.current, { scale: 0.9, transformOrigin: "50% 50%" });
			gsap.to(rightLineRef.current, { scale: 0.9, transformOrigin: "50% 50%" });
		}
		if (!mouseDown && mouseDown !== null) {
			console.log("ok");
			gsap.to(leftLineRef.current, { scale: 1, transformOrigin: "50% 50%" });
			gsap.to(rightLineRef.current, { scale: 1, transformOrigin: "50% 50%" });
		}
	}, [mouseDown]);

	useEffect(() => {
		if (mouseOver) {
			gsap.to(leftLineRef.current, { scale: 1.2, transformOrigin: "50% 50%" });
			gsap.to(rightLineRef.current, { scale: 1.2, transformOrigin: "50% 50%" });
		}
		if (!mouseOver && mouseOver !== null) {
			gsap.to(leftLineRef.current, { scale: 1, transformOrigin: "50% 50%" });
			gsap.to(rightLineRef.current, { scale: 1, transformOrigin: "50% 50%" });
		}
	}, [mouseOver]);
	return (
		<StyledCloseButton
			onMouseOver={() => setMouseOver(true)}
			onMouseLeave={() => setMouseOver(false)}
			onMouseDown={() => setMouseDown(true)}
			onMouseUp={() => setMouseDown(false)}
			onClick={() => props.setIsVisible(false)}
		>
			<svg
				version="1.1"
				id="Layer_1"
				width="80px"
				height="100px"
				viewBox="-10 0 201 201"
			>
				<StyledCircle ref={circleRef} cx="91" cy="91" rx="91" ry="91" />
				<StyledLine
					ref={leftLineRef}
					x1="56.1"
					y1="125.6"
					x2="126.8"
					y2="54.9"
				/>
				<StyledLine
					ref={rightLineRef}
					x1="56.2"
					y1="54.8"
					x2="126.8"
					y2="125.5"
				/>
			</svg>
		</StyledCloseButton>
	);
};
const NavContent = props => {
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
	const navContentRef = useRef(null);
	const linksQuery = gsap.utils.selector(navContentRef);
	useEffect(() => {
		const links = linksQuery(".links");
		gsap.fromTo(
			links,
			{ x: -400, y: -200, rotation: 30 },
			{ x: 0, y: 0, rotation: 0, delay: 0.2, duration: 0.3, stagger: 0.08 }
		);
	}, []);
	return (
		<Grid ref={navContentRef} container style={{ height: "100%" }}>
			<Grid
				item
				xs={12}
				md={4}
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				style={{ height: "100%" }}
				spacing={4}
			>
				{Object.entries(props.routes).map(([url, { name }]) => (
					<Grid className="links" key={url} item>
						<motion.div
							animate={{
								color:
									props.previewUrl !== null && url === -1
										? props.routes[props.previewUrl].previewTextColor
										: "#FFFFFF"
							}}
							transition={{ color: { duration: 1 } }}
							onMouseOver={() => props.setPreviewUrl(url)}
							onMouseLeave={() => props.setPreviewUrl(null)}
							onClick={() => props.setIsVisible(false)}
							style={{ display: "inline-block" }}
						>
							<Link href={url}>
								<StyledTypography
									animate={{
										scale: url === props.previewUrl ? 1 : 1,
										translateX: url === props.previewUrl ? "10px" : 0,
										translateY: url === props.previewUrl ? "-10px" : 0
									}}
									variant="h2"
								>
									{name}
								</StyledTypography>
							</Link>
							<AnimatePresence initial={false}>
								<motion.div
									style={{ transformOrigin: "50%" }}
									animate={{
										scaleX: url === props.previewUrl ? 1.1 : 0
									}}
								>
									<Underline />
								</motion.div>
							</AnimatePresence>
						</motion.div>
					</Grid>
				))}
			</Grid>
			{isDesktop && (
				<Grid item md={8}>
					<StyledTypography />
				</Grid>
			)}
		</Grid>
	);
};
const NavPage = props => {
	const [previewUrl, setPreviewUrl] = useState(null);
	console.log(props.routes[previewUrl]);
	return (
		<AnimatePresence initial={false}>
			{props.isVisible && (
				<StyledNavPage
					style={{ originY: 0 }}
					initial={{ translateY: "-100%" }}
					animate={{
						backgroundColor:
							previewUrl !== null
								? props.routes[previewUrl].previewColor
								: "rgba(73, 71, 77, 1)",
						translateY: 0,
						transition: { duration: 0.5 }
					}}
					exit={{ translateY: "-100%", transition: { duration: 0.5 } }}
				>
					<NavContent
						routes={props.routes}
						setIsVisible={props.setIsVisible}
						previewUrl={previewUrl}
						setPreviewUrl={setPreviewUrl}
					/>
				</StyledNavPage>
			)}
		</AnimatePresence>
	);
};
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
