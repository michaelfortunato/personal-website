import React from 'react'
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group'
import Gridline from './Gridline.js';
import useDeviceSize from './useDeviceSize.js';
import { motion } from "framer-motion";

const MIN_DURATION = 250;
const MIN_DELAY = 400;

const StyledGrid = styled(motion.div)`

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow:hidden;

    &.fade-out-appear-active, &.fade-out-enter-active{
        opacity: 0;
        transition: opacity;
        transition-duration: ${(props) => props.duration}ms;
        transition-delay: ${(props) => props.delay}ms;
    }
    &.fade-out-appear-done, &.fade-out-enter-done{
        opacity: 0;
    }


`
export default function Grid(props) {
    const [width, height] = useDeviceSize();
    const numRowLines = props.numLines;
    const numColLines = Math.floor(width / height * props.numLines + 1);
    const spacing = Math.floor(100 / props.numLines);

    const position = (i) => {
        let fixedPos = props.offset + spacing * i;
        let floatingPos = 100 * (props.random ? Math.random() : 0);
        return { fixedPos: fixedPos, floatingPos: floatingPos };
    }
    const timing = () => {
        let duration = MIN_DURATION + props.avgDuration * (false ? Math.random() : 1);
        let delay = MIN_DELAY + props.avgDelay * (props.random ? Math.random() : 1); //avgDelay + 200 * randn_bm(); 
        return { duration: duration, delay: delay };
    }
    const configuration = (i) => {
        let pos_conf = position(i);
        let time_conf = timing();
        return { ...pos_conf, ...time_conf, isDot: true }
    }
    const renderRowLines = () => {
        const rowLines = []
        for (let i = 1; i <= numRowLines; i++) {
            let conf = configuration(i);
            rowLines.push(<Gridline key={i} isRow={true} width = {width} height = {height} {...conf} />);
        }
        return rowLines;
    }
    const renderColLines = () => {
        const colLines = [];
        for (let i = 1; i <= numColLines; i++) {
            let conf = configuration(i);
            colLines.push(<Gridline key={i + props.numLines} isRow={false} width = {width} height = {height} {...conf} />);
        }
        return colLines;
    }
    return (
        <>
            {(width !== 0 && height !== 0) &&
                <StyledGrid initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onAnimationComplete={() => {
                        setTimeout(() => props.setTriggerNameEnter(true), 10000);
                    }}
                    duration={props.duration}>
                    {renderRowLines()}
                    {renderColLines()}
                </StyledGrid>
            }
        </>
    );
}
/*class Grid extends React.Component {
    static defaultProps = {
        random: true,
        numLines: 12,
        offset: 0,
        avgDuration: 150,
        avgDelay: 1500,
        duration: 750,
        isDot: true,
    }
    constructor(props) {
        super(props);
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.numRowLines = this.props.numLines;
        this.numColLines = Math.floor(this.w/this.h * this.props.numLines + 1);

        this.totalGridlineEnterTime = 0;
        this.spacing = Math.floor(100/this.props.numLines);
        this.rowLines = [];
        this.colLines = [];

        this.setRowLines();
        this.setColLines();

        console.log(this.totalGridlineEnterTime)
        setTimeout(this.props.setTriggerNameEnter, this.totalGridlineEnterTime)
        this.totalGridlineEnterTime = this.totalGridlineEnterTime + 250;
    }

    position(i) {
        let fixedPos = this.props.offset + this.spacing * i;
        let floatingPos = 100 * (this.props.random ? Math.random(): 0);
        return {fixedPos: fixedPos, floatingPos: floatingPos};
    }
    timing (avgDuration, avgDelay, random) {
        let duration = MIN_DURATION + this.props.avgDuration * (false ?  Math.random() : 1);
        let delay = MIN_DELAY + this.props.avgDelay * (this.props.random ?  Math.random() : 1); //avgDelay + 200 * randn_bm();
        return {duration: duration, delay : delay};
    }
    configuration(i) {
        let pos_conf  = this.position(i);
        let time_conf = this.timing();
        return {...pos_conf, ...time_conf, isDot: true}
    }
    setRowLines() {
        for (let i = 1; i <= this.numRowLines; i++) {
            let conf = this.configuration(i);
            this.totalGridlineEnterTime = Math.max(conf.duration + conf.delay, this.totalGridlineEnterTime);
            this.rowLines.push(<Gridline key = {i} isRow = {true} {...conf} />);
        }
    }
    setColLines() {
        for (let i = 1; i <= this.numColLines; i++) {
            let conf = this.configuration(i);
            this.totalGridlineEnterTime = Math.max(conf.duration + conf.delay, this.totalGridlineEnterTime);
            this.colLines.push(<Gridline key = {i + this.props.numLines} isRow = {false} {...conf} />)
        }
    }
    render() {
        return (
        <CSSTransition
            appear = {true}
            in = {true}
            timeout = {this.props.duration + this.totalGridlineEnterTime}
            classNames = 'fade-out'
            onEntered = {this.props.setGridEntered}
        >
            <StyledGrid duration = {this.props.duration}>
                {this.rowLines}
                {this.colLines}
            </StyledGrid>
        </CSSTransition>);
    }
} */

//export default Grid;