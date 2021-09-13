import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import gsap from 'gsap'
import { CustomEase } from "gsap/dist/CustomEase";
gsap.registerPlugin(CustomEase);

const StyledGridline = styled.div`
    position: absolute;
    background: white;
    z-index: 0;
    height: ${(props) => props.isRow ? `${props.circleSize}px` : '100%'};
    width: ${(props) => props.isRow ? '100%' : `${props.circleSize}px`};
    top: ${(props) => props.isRow ? `${props.fixedPos}vh` : 'initial'};
    left: ${(props) => props.isRow ? 'initial' : `${props.fixedPos}vh`};
    border-radius: 50%;
`;

const StyledGridlineFirefox = styled.div`
    position: absolute;
    background: white;
    z-index: 0;
    top: ${(props) => props.isRow ? `${props.fixedPos}%` : `${props.floatingPos}%`};
    left: ${(props) => props.isRow ? `${props.floatingPos}%` : `${props.fixedPos}%`};
    height: 10px;
    width: 10px;
    transform-origin: ${props => props.isRow ? `${props.floatingPos}%` : `${props.fixedPos}%`} ${props => props.isRow ? `${props.fixedPos}%` : `${props.floatingPos}%`};
    border-radius: 50%;
    &.line-appear, &.line-enter {
        transform-origin: ${props => props.isRow ? `${props.floatingPos}%` : `${props.fixedPos}%`} ${props => props.isRow ? `${props.fixedPos}%` : `${props.floatingPos}%`};
        border-radius: 50%;
        -webkit-border-radius: 50%;
    }
    &.line-appear-active, &.line-enter-active {
        transform-origin: ${props => props.isRow ? `${props.floatingPos}%` : `${props.fixedPos}%`} ${props => props.isRow ? `${props.fixedPos}%` : `${props.floatingPos}%`};
        transform: ${(props) => props.isRow ? `scaleX(${props.circleXScaling})` : `scaleY(${props.circleYScaling})`} ${(props) => props.isRow ? `scaleY(${.125})` : `scaleX(${.125})`};    
        transition-duration: ${(props) => props.duration}ms; 
        transition-delay: ${(props) => props.delay}ms; 
        transition-property: all;
        will-change: transform;
    }
    &.line-appear-done, &.line-enter-done {
        transform: ${(props) => props.isRow ? `scaleX(${props.circleXScaling})` : `scaleY(${props.circleYScaling})`} ${(props) => props.isRow ? `scaleY(${.125})` : `scaleX(${.125})`};    
        transform-origin: ${props => props.isRow ? `${props.floatingPos}%` : `${props.fixedPos}%`} ${props => props.isRow ? `${props.fixedPos}%` : `${props.floatingPos}%`};
    }
`;

const Gridline = (props) => {
    const circleSize = 10; //in pixels
    let circleXScaling;
    let circleYScaling;
    if (props.browser.name.toLowerCase() !== "firefox") {
        circleXScaling = circleSize / props.width;
        circleYScaling = circleSize / props.height;

    } else {
        circleXScaling = props.width / circleSize;
        circleYScaling = props.height / circleSize;
    }

    useEffect(() => {
        console.log(props.circleXScaling)
        gsap.set(nodeRef.current, {
            transformOrigin: props.isRow ? `${props.floatingPos}vh 50%` : `50% ${props.floatingPos}vh`,
            transform: props.isRow ? `scaleX(${circleXScaling})` : `scaleY(${circleYScaling})`
        })
        gsap.to(nodeRef.current, {
            scaleX: props.isRow ? 1 : .125, 
            scaleY: props.isRow ? .125 : 1,
            duration: `${props.duration/1000}`,
            delay: `${props.delay/1000}`,
            ease: CustomEase.create("custom", "M0,0 C0.25,0.1 0.25,1 1,1 ")
        })
    }, [])
    const nodeRef = React.useRef(null)
    return (<>
        {
            (props.browser.name.toLowerCase() !== "firefox") ?
                <StyledGridline ref={nodeRef} {...props}
                    circleSize={circleSize}
                    circleXScaling={circleXScaling}
                    circleYScaling={circleYScaling} />
                :
                <StyledGridlineFirefox ref={nodeRef} {...props}
                    circleSize={circleSize}
                    circleXScaling={circleXScaling}
                    circleYScaling={circleYScaling} />
        }
    </>
    );
}

Gridline.displayName = 'MyComponent';
export default Gridline;
