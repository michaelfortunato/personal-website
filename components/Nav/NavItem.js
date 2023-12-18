import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";

const Wrapper = styled.div`
	position: relative;
	top: 25%;
	font-size: 2.7em;
	font-family: "Lato", sans-serif;
`;

const StyledNavItem = styled(Link)`
    color: white;
}
`;
class NavItem extends React.Component {
	render() {
		const materialUIGridClass = this.props.isFirst
			? "col s1 offset-s8"
			: "col s1";
		return (
			<Wrapper className={materialUIGridClass}>
				<StyledNavItem onClick={this.props.toggle} href={this.props.url}>
					<a>{this.props.text}</a>
				</StyledNavItem>
			</Wrapper>
		);
	}
}

export default NavItem;
