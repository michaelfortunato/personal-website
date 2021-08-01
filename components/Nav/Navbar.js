import React, { useState } from 'react'
import styled from 'styled-components'
import NavContent from './NavContent.js';
import Navbutton from './Navbutton.js';
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { AnimatePresence, motion } from "framer-motion"
import { Fade as Hamburger } from "hamburger-react";
import Divider from "@material-ui/core/Divider"
import { useTheme } from '@material-ui/core';

const StyledNavbar = styled(Grid)`
    position: fixed; 
    ${({ theme }) => `color: #fff;`}
    padding: 1.5rem;
    z-index: 3;
`;

const Underline = styled(Divider)`
    ${({ theme }) => `background-color: #fff;`}
    height: 3px;
`

export default function Navbar(props) {
    const [isVisible, setIsVisible] = useState(false);
    console.log(useTheme());

    const underlineAnimations = {
        "activePage": {
            scaleX: 1
        },
        "inactivePage": {
            scaleX: 0
        }
    };

    return (
        <StyledNavbar container>
            <Grid item xs={1}>
                <Hamburger toggled={isVisible} toggle={() => setIsVisible(!isVisible)} />
            </Grid>
            <AnimatePresence initial={false}>
                {isVisible && <Grid
                    item
                    container
                    justifyContent="flex-end"
                    xs={11}
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {Object.entries(props.routes).map(([url, { name }]) =>
                        <Grid key={url} item container xs={12} md={1} alignItems="center">
                            <Grid item>
                                <Link href={url}>
                                    <a><Typography variant="button">{name}</Typography></a>
                                </Link>
                                <AnimatePresence initial={false}>
                                <motion.div style={{ originX: 0 }}
                                    variants={underlineAnimations}
                                    animate={url === props.currentPage ? "activePage" : "inactivePage"}>
                                    <Underline />
                                </motion.div>
                                </AnimatePresence>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                }
            </AnimatePresence>
        </StyledNavbar >
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