import React, { useRef } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

// TODO: Type later when we decide how to deal with emotion
const StyledLetter = styled.span<any>`
	position: relative;
	display: inline-block;
	animation-name: ${props =>
		enterKeyframe(props.x_offset_enter, props.y_offset_enter)};
	animation-duration: ${props => props.enter_duration}ms;
	animation-delay: ${props => props.enter_delay}ms;
	animation-fill-mode: forwards;
	transform: translate(
		${props => props.x_offset_enter}vw,
		${props => props.y_offset_enter}vh
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
	key: number;
	XOffsetEnter: number;
	YOffsetEnter: number;
	enterDuration: number;
	triggerNameEnter: boolean;
	enterDelay: number;
	char: string;
}) {
	return (
		<StyledLetter
			x_offset_enter={props.XOffsetEnter}
			y_offset_enter={props.YOffsetEnter}
			enter_duration={props.enterDuration}
			enter_delay={props.enterDelay}
		>
			{props.char}
		</StyledLetter>
	);
}
