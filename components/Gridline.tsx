import React from "react";
import styled, { keyframes } from "styled-components";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";

gsap.registerPlugin(CustomEase);

const animation = (isRow: boolean) =>
	isRow
		? keyframes`
 	to { transform: scaleX(1) scaleY(0.125) }
`
		: keyframes`
	to { transform: scaleX(0.125) scaleY(1) }
`;

const StyledGridline = styled.div<any>`
	position: absolute;
	background: white;
	z-index: 1;
  height: ${props =>
		props.isRow ? `${props.circleSize}px` : `${props.height}px`};
  width: ${props =>
		props.isRow ? `${props.width}px` : `${props.circleSize}px`};
	left: ${props => (props.isRow ? `initial` : `${props.fixedPos}vh`)};
  top: ${props => (props.isRow ? `${props.fixedPos}vh` : `initial`)};
	border-radius: 50%;
	transform-origin: ${props =>
		props.isRow ? `${props.floatingPos}vh 50%` : `50% ${props.floatingPos}vh`};
	transform: ${props =>
		props.isRow
			? `scaleX(${props.circleXScaling}) scaleY(1)`
			: `scaleX(1) scaleY(${props.circleYScaling})`};
	animation-name: ${props => props.animation};
  animation-duration: ${props => props.duration / 1000}s;
  animation-delay: ${props => props.delay / 1000}s;
	animation-fill-mode: forwards;
	animation-timing-function: ease-out;
	# animation-iteration-count: infinite;
`;

const Gridline = (props: any) => {
	const circleSize = 10; // in pixels
	let circleXScaling;
	let circleYScaling;
	if (props.browser.name.toLowerCase() !== "firefox") {
	} else {
	}
	circleXScaling = circleSize / props.width;
	circleYScaling = circleSize / props.height;
	console.log(props.browser.name.toLowerCase());

	/*

	useEffect(() => {
		console.log(props.circleXScaling);
		gsap.set(nodeRef.current, {
			transformOrigin: props.isRow
				? `${props.floatingPos}vh 50%`
				: `50% ${props.floatingPos}vh`,
			transform: props.isRow
				? `scaleX(${circleXScaling})`
				: `scaleY(${circleYScaling})`
		});
		gsap.to(nodeRef.current, {
			scaleX: props.isRow ? 1 : 0.125,
			scaleY: props.isRow ? 0.125 : 1,
			duration: `${props.duration / 1000}`,
			delay: `${props.delay / 1000}`,
			ease: CustomEase.create("custom", "M0,0 C0.25,0.1 0.25,1 1,1 ")
		});
	}, []);
  */

	const nodeRef = React.useRef(null);
	return (
		<StyledGridline
			ref={nodeRef}
			{...props}
			circleSize={circleSize}
			circleXScaling={circleXScaling}
			circleYScaling={circleYScaling}
			animation={animation(props.isRow)}
		/>
	);
};

Gridline.displayName = "MyComponent";
export default Gridline;
