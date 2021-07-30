import React from 'react'
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


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
:w

    
`;


class Letter extends React.Component {
    render() {
        return (
            <CSSTransition
                in={(this.props.triggerNameEnter) && (this.props.animateNameOut == false)}
                timeout={{
                    enter: this.props.durationEnter,
                    exit: this.props.durationExit + this.props.delayExit
                }}
                onEntered={this.props.setIsNameDone}
            >
                <StyledLetter
                    XOffsetEnter={this.props.XOffsetEnter}
                    YOffsetEnter={this.props.YOffsetEnter}
                    durationEnter={this.props.durationEnter}
                    XOffsetExit={this.props.XOffsetExit}
                    YOffsetExit={this.props.YOffsetExit}
                    durationExit={this.props.durationExit}
                    delayExit={this.props.delayExit}
                >
                    {this.props.char}
                </StyledLetter>
            </CSSTransition>
        );
    }
}
export { Letter, StyledLetter }