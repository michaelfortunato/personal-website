import React from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const StyledGridline = styled.div`
    position: absolute;
    background: white;
    z-index: 0;
    top: ${(props) => props.isRow ? `${props.fixedPos}%` : `${props.floatingPos}%`};
    left: ${(props) => props.isRow ? `${props.floatingPos}%`  : `${props.fixedPos}%`};
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

const Gridline = React.memo((props) => {
    const circleSize = 10; //in pixels
    const circleXScaling = props.width/circleSize;
    const circleYScaling = props.height/circleSize;
    console.log(props.width)
    console.log(props)
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
            width = {props.width}
            height = {props.height}
            circleXScaling={circleXScaling}
            circleYScaling={circleYScaling} />
    </CSSTransition>
    );
})

Gridline.displayName = 'MyComponent';
export default Gridline;
