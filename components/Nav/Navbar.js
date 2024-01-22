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
const NavContent = props => {
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
	const navContentRef = useRef(null);
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
