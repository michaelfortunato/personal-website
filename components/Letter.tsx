import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

// TODO: Type later when we decide how to deal with emotion
// Why is animation smoother here than with tailwindcss? See stash
const StyledLetter = styled(motion.span)<any>`
	position: relative;
	display: inline-block;
	will-change: transform;
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
			layout
			animate={{
				transform: `translate(0, 0)`
			}}
			transition={{
				duration: props.enterDuration / 1000,
				delay: props.enterDelay / 1000
			}}
			x_offset_enter={props.XOffsetEnter}
			y_offset_enter={props.YOffsetEnter}
		>
			{props.char}
		</StyledLetter>
	);
}
