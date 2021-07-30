import React, { useState } from 'react';
import styled from 'styled-components'
import Grid from '@components/Grid';
import Hero from '@components/Hero';
import { motion } from 'framer-motion'
import useDeviceSize from '@components/useDeviceSize';
const StyledHome = styled(motion.div)`
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #e6af4b;


    &.home-enter {
        opacity: 0;
    }
    &.home-enter-active {
        opacity: 1;
        background-color: #e6af4b;
        transition-property: opacity background-color;
        transition-duration: 3000ms;
    }
    &.home-enter-done {
        background-color: #e6af4b;
        opacity: 1;
    }

    &.home-exit {
        opacity: 1;
    }
    &.home-exit-active {
        opacity: 0;
        transition-property: opacity;
        transition-duration: 3000ms;
        transition-delay: 3000ms;
    }
    &.home-exit-done {
        opacity: 0;
    }
`;

const defaultGridConfig = {
    random : true,
    numLines : 12,
    offset : 0,
    avgDuration : 150,
    avgDelay : 1500,
    duration : 750,
    isDot : true
};
export default function Home(props) {
    const [gridEntered, setGridEntered] = useState(false);
    const [triggerNameEnter, setTriggerNameEnter] = useState(false);
    return (
        <StyledHome exit={{ opacity: 0 }} >
            {!gridEntered ? <Grid setGridEntered={setGridEntered} setTriggerNameEnter={setTriggerNameEnter} {...defaultGridConfig} /> : null}
            <Hero gridEntered={gridEntered} location={props.location} triggerNameEnter={triggerNameEnter} />
        </StyledHome>
    );
}
/*
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gridEntered: false, triggerNameEnter: false };
        this.setGridEntered = this.setGridEntered.bind(this);
        this.setTriggerNameEnter = this.setTriggerNameEnter.bind(this) //will bind ("this" to this class vs. the child class)
    }
    setGridEntered() {
        this.setState({ gridEntered: true });
    }
    setTriggerNameEnter() {
        this.setState({ triggerNameEnter: true });
    }
    render() {
        return (
            <StyledHome exit={{ opacity: 0 }} >
                { !this.state.gridEntered ? <Grid setGridEntered={this.setGridEntered} setTriggerNameEnter={this.setTriggerNameEnter} /> : null }
                <Hero gridEntered={this.state.gridEntered} location={this.props.location} triggerNameEnter={this.state.triggerNameEnter} />
            </StyledHome>
        );
    }
}

export default Home;
*/