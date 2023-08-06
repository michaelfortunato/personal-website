import React from "react";
import styled, { keyframes } from "styled-components";

const StyledLetter2 = styled.span<any>`
	position: relative;
	display: inline-block;

	transform: translate(
		${props => props.XOffsetEnter}vw,
		${props => props.YOffsetEnter}vh
	);

	&.letter-appear,
	&.letter-enter {
		transform: translate(
			${props => props.XOffsetEnter}vw,
			${props => props.YOffsetEnter}vh
		);
	}

	&.letter-appear-active,
	&.letter-enter-active {
		transform: translate(0, 0);

		transition: all;

		transition-duration: ${props => props.durationEnter}ms;
	}

	&.letter-appear-done,
	&.letter-enter-done {
		transform: translate(0, 0);
	}

	&.letter-exit {
		transform: translate(0, 0);
	}
	&.letter-exit-active {
		transform: translate(
			${props => props.XOffsetExit}vw,
			${props => props.YOffsetExit}vh
		);
		transition: all;
		transition-timing-function: cubic-bezier(0.36, 0, 0.66, -0.56);
		transition-duration: ${props => props.durationExit}ms;
		transition-delay: ${props => props.delayExit}ms;
	}
	&.letter-exit-done {
		transform: translate(
			${props => props.XOffsetExit}vw,
			${props => props.YOffsetExit}vh
		);
	}
`;

interface StyledLetterInterface {
	enterKeyframe: Keyframe;
	durationEnter: number;
	XOffsetEnter: number;
	YOffsetEnter: number;
}
// TODO: Type later when we decide how to deal with emotion
const StyledLetter = styled.span<any>`
	position: relative;
	display: inline-block;
	animation-name: ${props => props.enterKeyframe};
	animation-duration: ${props => props.durationEnter}ms;
	transform: translate(
		${props => props.XOffsetEnter}vw,
		${props => props.YOffsetEnter}vh
	);
`;

const enterKeyframe = (XOffsetEnter: number, YOffsetEnter: number) => keyframes`
	from {
		transform: translate(${XOffsetEnter}vw, ${YOffsetEnter}vh);
	}
  to {
      transform: translate(0, 0);
  }
`;

export default function Letter(props: {
	XOffsetEnter: number;
	YOffsetEnter: number;
	durationEnter: number;
	char: string;
}) {
	const enterKF = enterKeyframe(props.XOffsetEnter, props.YOffsetEnter);
	return (
		<StyledLetter
			XOffsetEnter={props.XOffsetEnter}
			YOffsetEnter={props.YOffsetEnter}
			durationEnter={props.durationEnter}
			enterKeyframe={enterKF}
		>
			{props.char}
		</StyledLetter>
	);
}
