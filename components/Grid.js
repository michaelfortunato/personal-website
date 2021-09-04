import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group'
import Gridline from './Gridline.js';
import useDeviceSize from './useDeviceSize.js';
import { motion } from "framer-motion";

const MIN_DURATION = 250;
const MIN_DELAY = 1000;

const StyledGrid = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
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

const resizeDelta = 200;
export default function Grid(props) {
    const [rowConfigs, setRowConfigs] = useState({});
    const [colConfigs, setColConfigs] = useState({});
    const [numColLines, setNumColLines] = useState(1);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let rconfigs = {};
        let cconfigs = {};
        const nrlines = props.numLines
        const nclines = Math.floor(width / height * props.numLines + 1)
        let gridEnterTimeout = 0;
        for (let i = 1; i <= nrlines; ++i) {
            rconfigs[i] = configuration(i)
            gridEnterTimeout = Math.max(gridEnterTimeout, rconfigs[i].duration + rconfigs[i].delay);

        }
        for (let i = 1; i <= nclines; ++i) {
            cconfigs[i] = configuration(i)
            gridEnterTimeout = Math.max(gridEnterTimeout, cconfigs[i].duration + cconfigs[i].delay);
        }
        setNumColLines(nclines);
        setRowConfigs(rconfigs);
        setColConfigs(cconfigs);
        setWidth(width)
        setHeight(height);
        
        setTimeout(() => props.setTriggerNameEnter(true), gridEnterTimeout);
        setTimeout(() => props.setTriggerGridExit(true), gridEnterTimeout + 250);
    }, [])
    
    const numRowLines = props.numLines;
    const spacing = Math.floor(100 / numRowLines);
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
    return (
        <>
            {(width !== 0 && height !== 0) &&
                <StyledGrid
                    onAnimationComplete={() => {
                    }}
                    duration={props.duration}>
                    {[...Array(numRowLines)].map((_, i) => {
                        return (
                            <Gridline key={i} isRow={true} width={width} height={height} {...rowConfigs[i+1]} />);
                    }
                    )}
                    {[...Array(numColLines)].map((_, i) => {
                        return (<Gridline key={i + props.numLines} isRow={false} width={width} height={height} {...colConfigs[i+1]} />);
                    }
                    )}
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