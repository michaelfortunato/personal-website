import React from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const StyledGridline = styled.div`
    position: absolute;
    background: white;
    z-index: 0;
    height: ${(props) => props.isRow ? `${props.circleSize}px` : '100%'};
    width: ${(props) => props.isRow ? '100%' : `${props.circleSize}px`};
    top: ${(props) => props.isRow ? `${props.fixedPos}vh` : 'initial'};
    left: ${(props) => props.isRow ? 'initial' : `${props.fixedPos}vh`};
    
    transform: ${(props => props.isRow ? 'scaleX(1) scaleY(.125)' : 'scaleY(1) scaleX(.125)')};
    
    &.line-appear, &.line-enter {
        transform-origin: ${(props) => props.isRow ? `${props.floatingPos}vh` : '50%'}
                        ${(props) => props.isRow ? '50%' : `${props.floatingPos}vh`};
        transform: ${(props) => props.isRow ? `scaleX(${props.circleXScaling})` : `scaleY(${props.circleYScaling})`};    
        border-radius: 50%;
        -moz-border-radius: 50%;
    }
    &.line-appear-active, &.line-enter-active {
        
        transform: ${(props) => props.isRow ? `scaleX(1) scaleY(.125)` : `scaleY(1) scaleX(.125)`};  
        transition-duration: ${(props) => props.duration}ms; 
        transition-delay: ${(props) => props.delay}ms; 
        transition-property: all;
        will-change: transform;
    }
    &.line-appear-done, &.line-enter-done {
        transform: ${(props => props.isRow ? 'scaleX(1) scaleY(.125)' : 'scaleY(1) scaleX(.125)')};
        border-radius: 0%;
    }
`;

const Gridline = React.memo((props) => {
    const circleSize = 10; //in pixels
    const circleXScaling = circleSize / props.width;
    const circleYScaling = circleSize / props.height;
    const nodeRef = React.useRef(null)
    return (<CSSTransition
        in={true}
        appear={true}
        classNames="line"
        timeout={props.duration + props.delay}
        nodeRef = {nodeRef}
        >
        <StyledGridline ref = {nodeRef} {...props}
            circleSize={circleSize}
            circleXScaling={circleXScaling}
            circleYScaling={circleYScaling} />
    </CSSTransition>
    );
})

Gridline.displayName = 'MyComponent';
export default Gridline;
