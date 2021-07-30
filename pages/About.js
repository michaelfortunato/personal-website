import React from 'react'
import styled from 'styled-components'
import AboutFirstPage from '@components/AboutFirstPage'

const StyledChildPage = styled.div`
    position: relative;
    padding: 0;
    border: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
`;

const StyledAbout = styled.div`
    width: 100vw;
    min-height:100vh;
    background-color: #14213D;
    position:absolute;
   
    &.about-enter {
        opacity: 0;
    }
    &.about-enter-active {
        opacity: 1;
        background-color: #14213D;
        transition-property: opacity background-color;
        transition-duration: 3000ms;
        transition-delay: 3000ms;
    }
    &.about-enter-done {
        opacity: 1;
        background-color: #14213D;
    }

    &.about-exit {
        opacity: 1;
    }
    &.about-exit-active {
        opacity: 0;
        transition-property: opacity;
        transition-duration: 3000ms;
    }
    &.about-exit-done {
        opacity: 0;
    }
`;
class About extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <StyledAbout delayEnter={this.props.delayEnter} >
                <AboutFirstPage />
            </StyledAbout>
            );
    }
}
export default About