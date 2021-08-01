import React, { useRef } from 'react'
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';


const StyledLetter = styled.span`
    position: relative;
    display:inline-block;

    transform: translate(${(props) => props.XOffsetEnter}vw, ${(props) => props.YOffsetEnter}vh); 

    &.letter-appear, &.letter-enter{
        transform: translate(${(props) => props.XOffsetEnter}vw, ${(props) => props.YOffsetEnter}vh); 
    }
    
    &.letter-appear-active, &.letter-enter-active{

        transform: translate(0, 0);

        transition: all;
       
        transition-duration: ${(props) => props.durationEnter}ms;
    
    }

    &.letter-appear-done, &.letter-enter-done{
         transform: translate(0, 0);
    }

    &.letter-exit {
        transform: translate(0,0);
    }
    &.letter-exit-active {
        transform: translate(${(props) => props.XOffsetExit}vw, ${(props) => props.YOffsetExit}vh);
        transition: all;
        transition-timing-function: cubic-bezier(0.36, 0, 0.66, -0.56);
        transition-duration: ${(props) => props.durationExit}ms;
        transition-delay: ${(props) => props.delayExit}ms;
    }
    &.letter-exit-done {
        transform: translate(${(props) => props.XOffsetExit}vw, ${(props) => props.YOffsetExit}vh);
    }
`;


export default function Letter(props) {
    const nodeRef = useRef(null);
        return (
            <CSSTransition
                in={(props.triggerNameEnter) && (props.animateNameOut == false)}
                classNames = "letter"
                timeout={{
                    enter: props.durationEnter,
                    exit: props.durationExit + props.delayExit
                }}
                onEntered={props.setIsNameDone}
                nodeRef = {nodeRef}
            >
                <StyledLetter
                    ref = {nodeRef}
                    XOffsetEnter={props.XOffsetEnter}
                    YOffsetEnter={props.YOffsetEnter}
                    durationEnter={props.durationEnter}
                    XOffsetExit={props.XOffsetExit}
                    YOffsetExit={props.YOffsetExit}
                    durationExit={props.durationExit}
                    delayExit={props.delayExit}
                >
                    {props.char}
                </StyledLetter>
            </CSSTransition>
        );
}