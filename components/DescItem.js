import React from 'react'
import styled, { keyframes } from 'styled-components'


const CaroselKeyframe = (movePercentage) => {
    return (
    keyframes`
        0% {
            opacity: 0;
            transform: translateY(-30px);
        }
        
        ${movePercentage/2}% {
            opacity:1;
            transform: translateY(-10px);
        }
        ${movePercentage}%, 100%{
            opacity:0;
            transform: translateY(30px);
        }
`);
}
const StyledDescItem = styled.div`
   
    position: absolute;
    /*left: 50%;
    top: 50%;*/
    opacity: 0;
    transform: translateY(-30px);



    /* @keyframes duration | timing-function | delay | 
    iteration-count | direction | fill-mode | play-state | name */
    animation: ${(props) => CaroselKeyframe(props.movePercentage)} ${(props) => props.totalTime}ms ease-in-out ${(props) => props.delay}ms infinite ;

`;

const DescItem = (props) => {
    return (
        <StyledDescItem movePercentage = {props.movePercentage} 
                        totalTime = {props.totalTime} 
                        delay = {props.delay}>
            {props.tag}
        </StyledDescItem>
    );
}

export default DescItem;