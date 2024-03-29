import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const CaroselKeyframe = (movePercentage: number) =>
  keyframes`
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        
        ${movePercentage / 2}% {
            opacity:1;
            transform: translateY(0px);
        }
        ${movePercentage}%, 100%{
            opacity:0;
            transform: translateY(40px);
        }
`;
const StyledDescItem = styled.div<any>`
  position: absolute;
  opacity: 0;
  transform: translateY(-30px);

  /* @keyframes duration | timing-function | delay | 
    iteration-count | direction | fill-mode | play-state | name */
  animation: ${(props) => CaroselKeyframe(props.movePercentage)}
    ${(props) => props.totalTime}ms ease-in-out ${(props) => props.delay}ms
    infinite;
`;

const DescItem = (props: any) => (
  <StyledDescItem
    movePercentage={props.movePercentage}
    totalTime={props.totalTime}
    delay={props.delay}
  >
    {props.tag}
  </StyledDescItem>
);

export default DescItem;
