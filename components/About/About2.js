import ReactDOM from "react-dom";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import {
	motion,
	useViewportScroll,
	useTransform,
	AnimatePresence
} from "framer-motion";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { darken } from "@material-ui/core";
import { useResizeDetector } from "react-resize-detector";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import { useInView } from "react-intersection-observer";
import Tooltip from "@material-ui/core/Tooltip";
import {
	MainContentBoxes,
	FLContentBoxes,
	NLContentBoxes,
	NRContentBoxes,
	FRContentBoxes
} from "./About2Config";

gsap.registerPlugin(MotionPathPlugin);
const ListOfContentBoxes = [
	MainContentBoxes,
	FLContentBoxes,
	NLContentBoxes,
	NRContentBoxes,
	FRContentBoxes
];
const StyledPage = styled(motion.div)`
	overflow: hidden;
	height: 400vh;
	width: 100vw;
	position: relative;
`;
const BlackTypography = styled(Typography)`
	color: black;
`;
const StyledLine = styled.path`
	fill: none;
	stroke: ${props => props.color};
	stroke-width: 34;
	stroke-linejoin: round;
	stroke-dasharray: 3100;
	stroke-dashoffset: 3100;
`;
const ContentBoxContainer = styled.div`
	position: absolute;
	left: ${props => props.x}%;
	top: ${props => props.y}%;
	display: inline;
	max-width: 33%;
	max-height: 50vh;
	overflow-y: auto;
	overflow-wrap: break-word; // breaks the word if it overflows
	opacity: 0;
`;
const createContentMachineTimeline = ({
	lineRef,
	arrowRef,
	boxRef,
	setIsClosing,
	setIsOpen,
	setRender,
	isLeft
}) => {
	if (
		boxRef.current === null ||
		lineRef.current === null ||
		arrowRef.current === null
	) {
		return null;
	} else {
		const pathLength = lineRef.current.getTotalLength();
		const arrowDuration = 0.5;
		gsap.set(lineRef.current, {
			strokeDasharray: pathLength
		});
		gsap.set(lineRef.current, { opacity: 1 });

		return (
			gsap
				.timeline({
					onReverseComplete: () => {
						setIsClosing(false);
						setRender(false);
						setIsOpen(false);
					},
					onComplete: () => {
						setIsOpen(true);
					}
				})
				//arrow appearing
				.fromTo(
					arrowRef.current,
					{ opacity: 0 },
					{
						opacity: 1,
						duration: 0.2
					}
				)
				//arrow moving out
				.to(
					arrowRef.current,
					{
						motionPath: {
							path: lineRef.current.getAttribute("d"),
							align: lineRef.current,
							autoRotate: true,
							alignOrigin: [0.5, 0.5],
							autoRotate: isLeft ? 180 : 0
						},
						duration: arrowDuration
					},
					"<"
				)
				//line moving out
				.fromTo(
					lineRef.current,
					{
						strokeDashoffset: pathLength
					},
					{
						strokeDashoffset: 0,
						duration: arrowDuration
					},
					"<"
				)
				// Box moving up
				.fromTo(
					boxRef.current,
					{ yPercent: -10, opacity: 0 },
					{ yPercent: 0, opacity: 1, duration: 0.5 },
					">-0.5"
				)
		);
	}
};
const BtoAx = x => (VIEWBOX_WIDTH / 100) * x - VIEWBOX_SHIFT_X;
const BtoAy = y => (VIEWBOX_HEIGHT / 100) * y;
const BPrimeToAx = (x, pageWidth) => (VIEWBOX_WIDTH / pageWidth) * x;
const BPrimeToAy = (y, pageHeight) => (VIEWBOX_HEIGHT / pageHeight) * y;
const useBoxPosition = ({
	boxRef,
	pageWidth,
	pageHeight,
	isLeft,
	boxPixelPosX,
	boxPixelPosY
}) => {
	const [boxPosX, setBoxPosX] = useState(0);
	const [boxPosY, setBoxPosY] = useState(0);
	useEffect(() => {
		if (boxRef.current !== null) {
			//debugger;
			const newBoxPosX = isLeft
				? BtoAx(boxPixelPosX) +
				  BPrimeToAx(boxRef.current.offsetWidth, pageWidth)
				: BtoAx(boxPixelPosX);
			const newBoxPosY =
				BtoAy(boxPixelPosY) +
				BPrimeToAy(boxRef.current.offsetHeight / 2, pageHeight);
			//debugger;
			setBoxPosX(newBoxPosX);
			setBoxPosY(newBoxPosY);
		} else {
			setBoxPosX(0);
			setBoxPosY(0);
		}
	});
	return [boxPosX, boxPosY];
};
const useArrowPosition = ({ arrowRef, pageWidth }) => {
	const [arrowWidth, setArrowWidth] = useState(0);
	useEffect(() => {
		if (arrowRef.current !== null) {
			const newArrowWidth = BPrimeToAx(
				arrowRef.current.getBoundingClientRect().width / 2,
				pageWidth
			);
			//debugger;
			setArrowWidth(newArrowWidth);
		} else {
			setArrowWidth(0);
		}
	});
	return [arrowWidth];
};
const ContentBoxMachine = props => {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const lineRef = useRef(null);
	const arrowRef = useRef(null);
	const boxRef = useRef(null);

	const isLeft =
		(props.boxId.includes("Main") && props.x < 50) ||
		props.boxId.includes("NR") ||
		props.boxId.includes("FR");
	const timeline = useRef(null);
	const [svgMountedOrUpdated, setSVGMountedOrUpdated] = useState(false);
	const [render, setRender] = useState(false);

	const [boxPosX, boxPosY] = useBoxPosition({
		boxRef,
		pageWidth: props.pageWidth,
		pageHeight: props.pageHeight,
		isLeft: isLeft,
		boxPixelPosX: props.x,
		boxPixelPosY: props.y
	});
	useEffect(() => {
		if (svgMountedOrUpdated && !isOpen) {
			timeline.current = createContentMachineTimeline({
				lineRef,
				arrowRef,
				boxRef,
				setIsClosing,
				setIsOpen,
				setRender,
				isLeft
			});
		}
	}, [svgMountedOrUpdated, isOpen]);
	useEffect(() => {
		if (isClosing) {
			if (svgMountedOrUpdated) {
				timeline.current.kill();
				timeline.current = createContentMachineTimeline({
					lineRef,
					arrowRef,
					boxRef,
					setIsClosing,
					setIsOpen,
					setRender,
					isLeft
				}).reverse(0);
			} else {
				timeline.current.reverse();
			}
		}
	}, [isClosing]);
	return (
		<>
			{ReactDOM.createPortal(
				<ContentBox boxRef={boxRef} render={render} {...props} />,
				props.pageRef
			)}
			{ReactDOM.createPortal(
				<SVGComponent
					render={render}
					setRender={setRender}
					setIsClosing={setIsClosing}
					isLeft={isLeft}
					boxPosX={boxPosX}
					boxPosY={boxPosY}
					lineRef={lineRef}
					boxRef={boxRef}
					arrowRef={arrowRef}
					setSVGMountedOrUpdated={setSVGMountedOrUpdated}
					pageWidth={props.pageWidth}
					pageHeight={props.pageHeight}
					{...props}
				/>,
				props.svgRef
			)}
		</>
	);
};
const ContentBox = props => {
	return props.render ? (
		<ContentBoxContainer ref={props.boxRef} x={props.x} y={props.y}>
			<Paper style={{ padding: 20 }}>
				<Grid container justifyContent="center">
					<Grid item xs={12}>
						<BlackTypography
							style={{
								textAlign: "center"
							}}
							variant={"h4"}
						>
							{props.title}
						</BlackTypography>
					</Grid>
					<Grid
						item
						xs={12}
						style={{
							marginTop: 4,
							marginBottom: 2
						}}
					>
						<Divider />
					</Grid>
					<Grid style={{ marginTop: 10 }} item xs={10}>
						<BlackTypography variant="body1">
							{props.body}
						</BlackTypography>
					</Grid>
				</Grid>
			</Paper>
		</ContentBoxContainer>
	) : null;
};
/* 
	Let A be the svgviewBox basis = {a_1, a_2}
	Let B be the percentage basis = {b_1, b_2}
	Let B` be the window pixel basis
	We need to find P which is the B to A transform matrix
	To do this we need to get the components of the basis vectors of B in terms of the basis vectors of a
	[b_1]_A = ? [b_2]_A = ?
	We set up the equation 100b_1 + 0b_2 = VIEWBOX_WIDTHa_1 + 0 a_2, 
	0b_1 + 1b_2 = 0a_1 + VIEWBOX_HEIGHTa_2
	=> [b_1]A = (VIEWBOX_WIDTH, 0)
	=> [b_2]A = (0, VIEWBOX_HEIGHT)
	A similar calculation shows that 
	P`, which is B` to A is
	[b_1`]A = (VIEWBOX_WIDTH/pageWidth, 0)
	[b_2`]A = (0, VIEWBOX_HEIGHT)
	*/
/*
const BtoAx = x => (VIEWBOX_WIDTH / 100) * x - VIEWBOX_SHIFT_X;
const BtoAy = y => (VIEWBOX_HEIGHT / 100) * y;
const BPrimeToAx = (x, pageWidth) => (VIEWBOX_WIDTH / pageWidth) * x;
const BPrimeToAy = (y, pageHeight) => (VIEWBOX_HEIGHT / pageHeight) * y;
const useBoxPosition = ({
	pageWidth,
	pageHeight,
	isOpen,
	isLoaded,
	isLeft,
	boxPixelPosX,
	boxPixelPosY,
	boxRef
}) => {
	const [boxPosX, setBoxPosX] = useState(0);
	const [boxPosY, setBoxPosY] = useState(0);
	useEffect(() => {
		if (boxRef.current !== null && isOpen) {
			const newBoxPosX = isLeft
				? BtoAx(boxPixelPosX) +
				  BPrimeToAx(boxRef.current.offsetWidth, pageWidth)
				: BtoAx(boxPixelPosX);
			const newBoxPosY =
				BtoAy(boxPixelPosY) +
				BPrimeToAy(boxRef.current.offsetHeight / 2, pageHeight);
			//debugger;
			setBoxPosX(newBoxPosX);
			setBoxPosY(newBoxPosY);
		} else {
			setBoxPosX(0);
			setBoxPosY(0);
		}
	}, [pageWidth, pageHeight, isOpen]);
	return [boxPosX, boxPosY];
};
*/
const useSyncedRef = ref => {
	const syncedRef = useRef(null);
	useEffect(() => {
		if (!ref) return;
		if (typeof ref === "function") ref(syncedRef);
		else ref.current = syncedRef.current;
	});
	return syncedRef;
};

const StyledCircle = styled(motion.path)`
	cursor: pointer;
	fill: #ffffff;
	stroke: #4d4d4d;
	stroke-width: 5;
`;
const SVGComponent = props => {
	const [arrowWidth] = useArrowPosition({
		arrowRef: props.arrowRef,
		pageWidth: props.pageWidth,
		pageHeight: props.pageHeight
	});
	useEffect(() => {
		if (props.boxPosX !== 0 && props.boxPosY !== 0 && arrowWidth !== 0) {
			props.setSVGMountedOrUpdated(true);
		} else {
			props.setSVGMountedOrUpdated(false);
		}
	}, [props.boxPosX, props.boxPosY, arrowWidth]);
	const className =
		props.boxId.substring(0, props.boxId.indexOf("-")) + "-Circle";
	return (
		<>
			<StyledCircle
				className={className}
				d={props.cd}
				whileHover={{
					scale: 2
				}}
				whileTap={{ scale: 1.5 }}
				onClick={() => {
					if (!props.render) {
						props.setRender(true);
					} else {
						props.setIsClosing(true);
					}
				}}
			/>
			{props.render && (
				<>
					<SVGLine
						lineRef={props.lineRef}
						boxPosX={props.boxPosX}
						boxPosY={props.boxPosY}
						arrowWidth={arrowWidth}
						isLeft={props.isLeft}
						ld={props.ld}
					/>
					<SVGArrow
						arrowRef={props.arrowRef}
						boxPosX={props.boxPosX}
						boxPosY={props.boxPosY}
						ad={props.ad}
					/>
				</>
			)}
		</>
	);
};

const SVGArrow = props => {
	const mountable = props.boxPosX !== 0 && props.boxPosY !== 0;
	if (!mountable) return null;

	const adArray = props.ad.split(",");
	const arrowShiftX = adArray[0].substring(1); //M<number>
	const arrowShiftY = adArray[1].substring(0, adArray[1].indexOf("c")); //<number>c<number>
	return (
		<motion.path
			ref={props.arrowRef}
			className="st7"
			d={props.ad}
			transform={`translate(${props.boxPosX - arrowShiftX} ${
				props.boxPosY - arrowShiftY
			})`}
		/>
	);
};

const SVGLine = props => {
	const mountable =
		props.boxPosX !== 0 && props.boxPosY !== 0 && props.arrowWidth !== 0;
	useEffect(() => {
		if (mountable) {
			//const pathLength = props.lineRef.current.getTotalLength();
			//gsap.set(props.lineRef.current, { strokeDasharray: pathLength });
		}
	}, [props.boxPosX, props.boxPosY, props.arrowWidth]);

	if (!mountable) return null;

	const ldPointsToSVGStringReducer = (svgString, tuple, index) =>
		index === 0
			? svgString + `M${tuple[0]},${tuple[1]}`
			: svgString + " " + `${tuple[0]},${tuple[1]}`;
	// Get lds to transform them
	let ldPoints = new Array();
	props.ld.split(" ").forEach((pair, _) => {
		let [x, y] = String(pair).replace("M", "").split(",");
		x = Number(x);
		y = Number(y);
		if (!isNaN(x) && !isNaN(y)) {
			ldPoints.push([x, y]);
		}
	});

	const originalLength = Math.abs(
		ldPoints[ldPoints.length - 1][0] - ldPoints[0][0]
	);
	const desiredLength = Math.abs(ldPoints[0][0] - props.boxPosX);
	const scaleFactor = (desiredLength / originalLength) * 0.7;
	const shiftFactor = ldPoints[0][0];

	ldPoints.forEach((pair, index) => {
		if (index !== 0) {
			ldPoints[index][0] =
				(ldPoints[index][0] - shiftFactor) * scaleFactor + shiftFactor;
		}
	});
	// Next set the y val
	ldPoints[ldPoints.length - 1][1] = props.boxPosY;

	const finalPos = [
		props.isLeft
			? props.boxPosX + props.arrowWidth
			: props.boxPosX - props.arrowWidth,
		props.boxPosY
	];
	ldPoints.push(finalPos);
	return (
		<motion.path
			ref={props.lineRef}
			className="st6"
			d={ldPoints.reduce(ldPointsToSVGStringReducer, "")}
		/>
	);
};

const StyledTimelineIntro = styled.div`
	position: absolute;
	top: 20vh;
	left: 60%;
	color: white;
	display: block;
	opacity: 0;
`;
const TimelineIntro = props => {
	const [animationIsDone, setAnimationIsDone] = useState(false);
	const timeline = useRef(null);
	useEffect(() => {
		const query = gsap.utils.selector(document.body);
		const introElements = query(".tlIntro");
		timeline.current = gsap.timeline({
			onComplete: () => {
				props.setReleaseScroll(true);
				setAnimationIsDone(true);
			}
		});
		const stayTimes = [1.24, 1.24, 2];
		const leaveAnimation = {};
		introElements.forEach((elem, index) => {
			let leaveAnimation = {};
			if (index === introElements.length - 1) {
				leaveAnimation = { opacity: 0, duration: 0.4 };
			} else {
				leaveAnimation = { opacity: 0, duration: 0.4 };
			}

			timeline.current
				.fromTo(
					elem,
					{ transform: "translateY(-10vh)" },
					{
						transform: `translateY(0)`,
						opacity: 1,
						duration: 0.4
					},
					`${index !== 0 ? ">0.2" : "<0.2"}`
				)
				.to(elem, leaveAnimation, `>${stayTimes[index]}`);
		});
	}, []);
	return (
		!animationIsDone && (
			<>
				<StyledTimelineIntro className="tlIntro">
					<Grid container justifyContent="center">
						<Grid item xs={12}>
							<Typography variant="h4">
								This is a timeline of my life.
							</Typography>
						</Grid>
					</Grid>
				</StyledTimelineIntro>
				<StyledTimelineIntro className="tlIntro">
					<Grid container justifyContent="center">
						<Grid item xs={12}>
							<Typography variant="h4">
								Red for the 1 train (the best train).
							</Typography>
						</Grid>
					</Grid>
				</StyledTimelineIntro>
				<StyledTimelineIntro className="tlIntro">
					<Grid container justifyContent="center">
						<Grid item xs={12}>
							<Typography variant="h4">
								Click on the subway stops to learn about me.
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h4">
								Thanks for visiting!
							</Typography>
						</Grid>
					</Grid>
				</StyledTimelineIntro>
			</>
		)
	);
};
const scaleFactor = 1;
const VIEWBOX_WIDTH = scaleFactor * 3658.6;
const VIEWBOX_HEIGHT = scaleFactor * 6486.5;
const VIEWBOX_SHIFT_X =
	scaleFactor !== 1 ? VIEWBOX_WIDTH / (scaleFactor * 2 * 2) : 0;

const ToolTip = props => {
	return (
		<AnimatePresence>
			{props.tooltipConfig && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, scale: 1.1 }}
					exit={{ opacity: 0, scale: 0 }}
					style={{
						zIndex: 0,
						position: "absolute",
						left: props.tooltipConfig.x,
						top: props.tooltipConfig.y
					}}
				>
					<Typography style={{ color: "white" }} variant="body1">
						{props.tooltipConfig.description}
					</Typography>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const BulidTimeline = (lineId, circleQuery, circleClass, options) => {
	let timeline = null;
	const circles = circleQuery(circleClass);
	if (circleClass !== ".Main-Circle") circles.reverse();
	const line = document.getElementById(lineId);
	if (line !== null && circles.length !== 0) {
		const lineLength = line.getTotalLength();
		gsap.set(line, {
			strokeDasharray: lineLength,
			strokeDashoffset: lineLength
		});
		timeline = gsap
			.timeline({ paused: options.paused })
			.to(line, options.lineAni)
			.fromTo(
				circles,
				{ scale: 0, opacity: 0 },
				{
					scale: 1.3,
					opacity: 1,
					stagger: 0.4,
					duration: 0.5
				},
				`<${options.circleDelay}`
			)
			.to(
				circles,
				{
					scale: 1,
					stagger: 0.4,
					duration: 0.5
				},
				"<0.5"
			);
	}
	return timeline;
};

function buildAllTimelines(timelineConfigs, circleQuery) {
	const timelines = timelineConfigs.map(({ tlId, circleClass, lineAni }) =>
		BulidTimeline(tlId, circleQuery, circleClass, {
			circleDelay: 6.2,
			paused: true,
			lineAni: {
				strokeDashoffset: 0,
				duration: 1,
				ease: "none"
			}
		})
	);
	return timelines;
}

const timelineAnimationConfigs = [
	{
		tlId: "MainLine",
		circleClass: ".Main-Circle",
		lineAni: {
			strokeDashoffset: 0,
			duration: 1,
			ease: "none"
		}
	},
	{
		tlId: "FL",
		circleClass: ".FL-Circle",
		lineAni: {
			strokeDashoffset: 0,
			duration: 1,
			ease: "none"
		}
	},
	{
		tlId: "NL",
		circleClass: ".NL-Circle",
		lineAni: {
			strokeDashoffset: 0,
			duration: 1,
			ease: "none"
		}
	},
	{
		tlId: "NR",
		circleClass: ".NR-Circle",
		lineAni: {
			strokeDashoffset: 0,
			duration: 1,
			ease: "none"
		}
	},
	{
		tlId: "FR",
		circleClass: ".FR-Circle",
		lineAni: {
			strokeDashoffset: 0,
			duration: 1,
			ease: "none"
		}
	}
];

export default function About2(props) {
	const [hasMounted, setHasMounted] = useState(false);
	const [introAlreadyMounted, setIntroAlreadyMounted] = useState(false);
	const [tooltipConfig, setTooltipConfig] = useState(null);
	const svgRef = useRef(null);

	const redTimeline = useRef(null);
	const otherTimelines = useRef(null);
	const {
		width: pageWidth,
		height: pageHeight,
		ref: pageRef
	} = useResizeDetector({
		refreshMode: "debounce",
		refreshRate: 300
	});

	const [redLineAniRef, redLineInView] = useInView();
	const [otherLinesAniRef, otherLinesInView] = useInView();
	const renderTooltip = (e, description) => {
		const bounds = pageRef.current.getBoundingClientRect();
		const x = e.clientX - bounds.left - 120; //shift x by alot to the left
		const y = e.clientY - bounds.top;
		setTooltipConfig({ x: x, y: y, description: description });
	};
	useEffect(() => {
		if (hasMounted) {
			const circleQuery = gsap.utils.selector(svgRef);
			const timelines = buildAllTimelines(
				timelineAnimationConfigs,
				circleQuery
			);
			redTimeline.current = timelines[0];
			otherTimelines.current = gsap.timeline({ paused: true });
			timelines.forEach((timeline, index) => {
				if (index === 1) {
					otherTimelines.current.add(timeline, "<");
				} else if (index !== 0) {
					otherTimelines.current.add(timeline, "<2");
				}
			});
		}
	}, [hasMounted]);
	useEffect(() => setHasMounted(true));
	useEffect(() => {
		if (otherLinesInView) {
			otherTimelines?.current.play();
		}
	}, [otherLinesInView]);

	if (props.triggerTlIntro && redTimeline.current !== null)
		setTimeout(() => redTimeline.current.play(), 1000);

	const BtoAx = x => (VIEWBOX_WIDTH / 100) * x - VIEWBOX_SHIFT_X;
	const BtoAy = y => (VIEWBOX_HEIGHT / 100) * y;
	const BPrimeToAx = x => (VIEWBOX_WIDTH / pageWidth) * x;
	const BPrimeToAy = y => (VIEWBOX_HEIGHT / pageHeight) * y;
	return (
		<StyledPage ref={pageRef}>
			{pageRef.current !== null &&
				svgRef.current !== null &&
				ListOfContentBoxes.map((ContentBoxGroup, i) =>
					ContentBoxGroup.map((props, i) => (
						<ContentBoxMachine
							key={props.key}
							pageRef={pageRef.current}
							svgRef={svgRef.current}
							boxId={props.key}
							pageWidth={pageWidth}
							pageHeight={pageHeight}
							BtoAx={BtoAx}
							BtoAy={BtoAy}
							BPrimeToAx={BPrimeToAx}
							BPrimeToAy={BPrimeToAy}
							{...props}
							cd={props.cd}
							ld={props.ld}
							ad={props.ad}
						/>
					))
				)}
			<svg
				version="1.1"
				className="SVGContainer"
				xmlns="http://www.w3.org/2000/svg"
				width="100%"
				height="100%"
				viewBox={`${-VIEWBOX_SHIFT_X} 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
				preserveAspectRatio="none"
			>
				<StyledLine
					id="FL"
					color="#FF6319"
					d="M1818.9,2976.7L249,3243.2l-2.6,3243.2"
				/>
				<StyledLine
					id="NL"
					color="#0039A6"
					d="M1814.1,2976.3l-503.4,210.9l4.3,3299.2"
				/>
				<StyledLine
					id="NR"
					color="#FCCC0A"
					d="M1814.7,2974.9l489.4,210.9l3.7,3300.7"
				/>
				<StyledLine
					id="FR"
					color="#00933C"
					d="M1807,2976.3l1571.9,266.9l-2.6,3243.2"
				/>
				<StyledLine
					onMouseOver={e => renderTooltip(e, "Main timeline")}
					onMouseOut={() => setTooltipConfig(null)}
					id="MainLine"
					color="#EE352E"
					d="M1728.4,0v101.8l-66.8,43.2v4.1V809l150,224.6l2.6,1964.4"
				/>
				<g ref={svgRef} style={{ outline: "none" }} />
			</svg>
			<div
				ref={otherLinesAniRef}
				style={{
					position: "absolute",
					opacity: 0,
					top: "50%"
				}}
			/>
			{(props.triggerTlIntro || introAlreadyMounted) && (
				<TimelineIntro setReleaseScroll={props.setReleaseScroll} />
			)}
		</StyledPage>
	);
}
