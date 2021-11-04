import ReactDOM from "react-dom";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import { motion, useViewportScroll } from "framer-motion";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import { assetsURL } from "../../utils/configurations";
import useSWR, { mutate } from "swr";
import matter from "gray-matter";
import axios from "axios";

gsap.registerPlugin(MotionPathPlugin);

const BlackTypography = styled(Typography)`
	color: black;
`;
const scaleFactor = 1;
const VIEWBOX_WIDTH = scaleFactor * 3658.6;
const VIEWBOX_HEIGHT = scaleFactor * 6486.5;
const VIEWBOX_SHIFT_X =
	scaleFactor !== 1 ? VIEWBOX_WIDTH / (scaleFactor * 2 * 2) : 0;
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
// generate curving line
function generateSmoothLine(
	{ x0, y0 },
	{ xn, yn },
	ptsBetween,
	initYDirection
) {
	if (initYDirection !== -1 && initYDirection !== 1) {
		throw "Give a valid initial y direction.";
	}
	if (ptsBetween < 1) {
		throw "Could not generate smooth line.";
	}

	let spacing = 0.15; //spacing !== null ? spacing : 1/(ptsBetween + 1)
	let deltaX = Math.abs(xn - x0);
	let deltaY = yn - y0;

	const xDirection = xn - x0 < 0 ? -1 : 1;
	let prevYDirection = [];
	let pts = [];
	new Int8Array(ptsBetween + 1).forEach((val, i) => {
		console.log(i);
		if (i === 0) {
			prevYDirection.push(initYDirection);
			pts.push([x0, y0]);
		} else {
			const xi =
				pts[i - 1][0] + xDirection * (1 / (ptsBetween + 1)) * deltaX;
			const yScale =
				prevYDirection[i - 1] * deltaY < 0
					? Math.random() * (0.5 + 0.15)
					: Math.random() + 0.7;
			const yi = y0 + prevYDirection[i - 1] * Math.abs(deltaY) * yScale;

			const yDirection = Math.random() < 0.5 ? -1 : 1;
			prevYDirection.push(yDirection);
			pts.push([xi, yi]);
		}
	});
	pts[ptsBetween][1] = yn;
	pts.push([xn, yn]);
	return pts;
}
// All credits to francois romain for teaching me this
//https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
const line = (previous, next) => {
	const lengthX = next[0] - previous[0];
	const lengthY = next[1] - previous[1];
	return {
		length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
		angle: Math.atan2(lengthY, lengthX)
	};
};
const controlPoint =
	smoothing => (currentAnchor, previousAnchor, nextAnchor, direction) => {
		let previous = previousAnchor || currentAnchor;
		let next = nextAnchor || currentAnchor;
		const lineProperties = line(previous, next);

		// Ratio of A to O A:O => cotan(angle) * O = A
		const angle =
			lineProperties.angle + (direction === "reverse" ? Math.PI : 0);
		const length = lineProperties.length * smoothing;
		const x = currentAnchor[0] + Math.cos(angle) * length;
		const y = currentAnchor[1] + Math.sin(angle) * length;
		return [x, y];
	};

const bezierCommand = createControlPoint => (point, index, points) => {
	// start control point
	const [cpsX, cpsY] = createControlPoint(
		points[index - 1],
		points[index - 2],
		point,
		"forwards"
	);
	// end control point
	const [cpeX, cpeY] = createControlPoint(
		point,
		points[index - 1],
		points[index + 1],
		"reverse"
	);
	return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
};

const smoothPoints = (points, smoothing = 0.15) => {
	const createControlPoint = controlPoint(smoothing);
	const smoothCommand = bezierCommand(createControlPoint);
	const d = points.reduce(
		(svgString, point, index, points) =>
			index === 0
				? `M ${point[0]},${point[1]}`
				: `${svgString} ${smoothCommand(
						point,
						index,
						points,
						createControlPoint
				  )}`,
		""
	);
	return d;
};
const SVGLine = props => {
	useEffect(() => {
		if (mountable) {
			const pathLength = props.lineRef.current.getTotalLength();
			gsap.set(props.lineRef.current, { strokeDasharray: pathLength });
		}
	}, [props.boxPosX, props.boxPosY, props.arrowWidth]);
	const mountable =
		props.boxPosX !== 0 && props.boxPosY !== 0 && props.arrowWidth !== 0;
	if (!mountable) return null;

	const ldPointsToSVGStringReducer = (svgString, tuple, index) =>
		index === 0
			? svgString + `M${tuple[0]},${tuple[1]}`
			: svgString + " " + `${tuple[0]},${tuple[1]}`;
	// Get lds to transform them
	let ldPoints = [];
	let temp = [];
	props.ld.split(",").forEach((point, index) => {
		point = parseInt(point.replace("M", ""));
		if (index % 2 !== 0) {
			ldPoints.push([temp.pop(), point]);
		} else {
			temp.push(point);
		}
	});
	const originalLength = Math.abs(
		ldPoints[ldPoints.length - 1][0] - ldPoints[0][0]
	);
	const desiredLength = Math.abs(ldPoints[0][0] - props.boxPosX);
	const scaleFactor = (desiredLength / originalLength) * 0.6;
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
	const d = smoothPoints(ldPoints, 0.2);
	//	ldPoints.push(finalPos);

	return <motion.path ref={props.lineRef} className="st6" d={d} />;
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
const prefetch = url => {
	mutate(
		url,
		axios.get(url).then(res => res.json())
	);
};
export default function ContentBoxMachine({
	boxData: { boxId, content, title, x, y },
	svgData: { cd, ld, ad, svgRef },
	pageData: { pageWidth, pageHeight, pageRef }
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const lineRef = useRef(null);
	const arrowRef = useRef(null);
	const boxRef = useRef(null);

	const isLeft =
		(boxId.includes("Main") && x < 50) ||
		boxId.includes("NR") ||
		boxId.includes("FR");
	const timeline = useRef(null);
	const [svgMountedOrUpdated, setSVGMountedOrUpdated] = useState(false);
	const [render, setRender] = useState(false);

	const [boxPosX, boxPosY] = useBoxPosition({
		boxRef,
		pageWidth: pageWidth,
		pageHeight: pageHeight,
		isLeft: isLeft,
		boxPixelPosX: x,
		boxPixelPosY: y
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

	/*
	const url = `https://assets.michaelfortunato.org/${props.blurb.documentId}`;
	const { data: content, error } = useSWR(
		url,
		axios.get(url).then(res => {
			const { content } = matter(res.data);
			return { data: content };
		}),
		{
			fallbackData: props.blurb.content
		}
	);*/

	return (
		<>
			{ReactDOM.createPortal(
				<ContentBox
					boxRef={boxRef}
					render={render}
					x={x}
					y={y}
					title={title}
					body={content}
				/>,
				pageRef
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
					pageWidth={pageWidth}
					pageHeight={pageHeight}
					cd={cd}
					ld={ld}
					ad={ad}
					boxId={boxId}
				/>,
				svgRef
			)}
		</>
	);
}
