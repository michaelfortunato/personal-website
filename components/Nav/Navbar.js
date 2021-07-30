import React, { useState } from 'react'
import styled from 'styled-components'
import NavContent from './NavContent.js';
import Navbutton from './Navbutton.js';


const StyledNavbar = styled.div`
    width: 100%;
    height: 25%;
    font-size: 5px;
    position: absolute;

`;

const NavConfiguration = {
    '/': { backgroundColor: "#264653", textColor: "white" },
    '/about': { backgroundColor: "#9ac6c5", textColor: "black" }
}

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isVisible: false }
        this.setIsVisible = this.setIsVisible.bind(this);
    }
    setIsVisible() {
        this.setState((state) => ({ isVisible: !state.isVisible }))
    }
    render() {
        console.log(`Is Open: ${this.state.isVisible}`)
        let styleConfig = NavConfiguration[this.props.location];
        return (
            <StyledNavbar>
                <Navbutton isVisible={this.state.isVisible} setIsVisible={this.setIsVisible} styleConfig={styleConfig} />
                <NavContent isVisible={this.state.isVisible} setIsVisible={this.setIsVisible} styleConfig={styleConfig} />
            </StyledNavbar>
        );
    }
}
export default Navbar;