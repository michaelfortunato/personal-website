import React, { useState } from 'react'
import styled from 'styled-components'
import NavContent from './NavContent.js';
import Navbutton from './Navbutton.js';
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { Fade as Hamburger } from "hamburger-react";
import  Divider  from '@material-ui/core/Divider';
const StyledNavbar = styled(Grid)`
    position: fixed; 
    color: white;
    padding: 1rem;
`;

export default function Navbar(props) {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <StyledNavbar container>
            <Grid item xs={1}>
                <Hamburger toggled={isVisible} toggle={() => setIsVisible(!isVisible)} />
            </Grid>
            <Grid item container justifyContent="flex-end" xs={11}>
                {Object.entries(props.routes).map(([url, { name }]) =>
                    <Grid key={url} item container xs={12} md={1} alignItems="center">
                        <Grid item>
                            <Link href={url}>
                                <a><Typography variant="button">{name}</Typography></a>
                            </Link>
                            <Divider />
                        </Grid>
                    </Grid>
                )}</Grid>
        </StyledNavbar>
    );
}
/*
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
*/