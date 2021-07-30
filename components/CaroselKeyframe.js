import React from 'react'

const CaroselKeyframe = (props) => {
    return (keyframes`
    0% {
        opacity: 0;
        transform: translateY(-50px);
    }
    
    20%, 25%, 30% {
        opacity:1;
        transform: translateY(0);
    }
    ${() => props.movePercentage}%, 100%{
        opacity:0;
        transform: translateY(50px);
    }
`);
}

export default CaroselKeyframe;