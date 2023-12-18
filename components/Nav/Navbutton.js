import React from "react";
import styled from "@emotion/styled";
import Hamburger from "hamburger-react";

const StyledNavbutton = styled.div`
    position: absolute;
    top: 15%;
    left:1.5%;
    color ${props => props.backgroundColor}; 
    z-index: 2;
    cursor: pointer;

`;

class Navbutton extends React.Component {
	render() {
		return (
			<StyledNavbutton backgroundColor={this.props.styleConfig.backgroundColor}>
				<Hamburger
					size={45}
					toggled={this.props.isVisible}
					toggle={this.props.setIsVisible}
				/>
			</StyledNavbutton>
		);
	}
}

export default Navbutton;
