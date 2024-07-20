import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";

gsap.registerPlugin(CustomEase);

const animation = (
  isRow: boolean,
  circleXScaling: number,
  circleYScaling: number,
) =>
  isRow
    ? keyframes`
 	to { 
		transform: scaleX(${circleXScaling}) scaleY(0.125);
		border-radius: 0%; /* Needed from Chrome Performance */
 	}
	`
    : keyframes`
	to { 
		transform: scaleX(0.125) scaleY(${circleYScaling});
		border-radius: 0%; /* Needed from Chrome Performance */
	}
`;

const StyledGridlineRow = styled.div<any>`
  position: absolute;
  background: white;
  height: ${(props) => `${props.circleSize}px`};
  width: ${(props) => `${props.circleSize}px`};
  left: ${(props) => `${props.floatingPos}vw`};
  top: ${(props) => `${props.fixedPos}vh`};
  border-radius: 50%;

  /* TODO: Needed for Chrome. Why? */
  transform: scaleX(1) scaleY(1); /* TODO: Needed for Chrome. Why? */
  will-change: transform; /* TODO: Needed for Chrome. Why? */

  animation-name: ${(props) => props.animation};
  animation-duration: ${(props) => props.duration / 1000}s;
  animation-delay: ${(props) => props.delay / 1000}s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
`;

const StyledGridlineColumn = styled.div<any>`
  position: absolute;
  background: white;
  height: ${(props) => `${props.circleSize}px`};
  width: ${(props) => `${props.circleSize}px`};
  left: ${(props) => `${props.fixedPos}vw`};
  top: ${(props) => `${props.floatingPos}vh`};
  border-radius: 50%;

  /* TODO: Needed for Chrome. Why? */
  transform: scaleX(1) scaleY(1); /* TODO: Needed for Chrome. Why? */
  will-change: transform; /* TODO: Needed for Chrome. Why? */

  animation-name: ${(props) => props.animation};
  animation-duration: ${(props) => props.duration / 1000}s;
  animation-delay: ${(props) => props.delay / 1000}s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
`;
function Gridline(props: any) {
  const circleSize = 10; // in pixels
  let circleXScaling = (props.width / circleSize) * 2;
  let circleYScaling = (props.height / circleSize) * 2;
  // TODO: React, what is the difference between a const and let in function
  const ani = animation(props.isRow, circleXScaling, circleYScaling);

  return props.isRow ? (
    <StyledGridlineRow
      {...props}
      circleSize={circleSize}
      circleXScaling={circleXScaling}
      circleYScaling={circleYScaling}
      animation={ani}
    />
  ) : (
    <StyledGridlineColumn
      {...props}
      circleSize={circleSize}
      circleXScaling={circleXScaling}
      circleYScaling={circleYScaling}
      animation={ani}
    />
  );
}

Gridline.displayName = "Gridline";
export default Gridline;
