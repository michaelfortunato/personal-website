import React, { useState } from 'react'
import styled from 'styled-components'
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { AnimatePresence, motion } from "framer-motion"
import { Twirl as Hamburger } from "hamburger-react";
import Divider from "@material-ui/core/Divider"

const StyledNavbar = styled(Grid)`
    position: fixed; 
    ${({ theme }) => `color: #fff;`}
    padding: 1.5rem;
    z-index: 3;
`;

const Underline = styled(Divider)`
    ${({ theme }) => `background-color: #fff;`}
    height: 2px;
`
const MotionGrid = motion(Grid);
const MotionTypography = motion(Typography);

export default function Navbar(props) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(null);
    const underlineAnimations = {
        "activePage": {
            scaleX: 1,
        },
        "inactivePage": {
            scaleX: 0
        }
    };

    return (
        <StyledNavbar container>
            <Grid item xs={1}>
                <Hamburger duration={0.2} toggled={isVisible} toggle={() => setIsVisible(!isVisible)} />
            </Grid>
            <AnimatePresence initial={false}>
                {isVisible && <Grid
                    item
                    container
                    justifyContent="flex-end"
                    xs={11}
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: .25 } }}
                    exit={{ opacity: 0, transition: { duration: .25 } }}
                >
                    {Object.entries(props.routes).map(([url, { name }]) =>
                        <Grid key={url} item container xs={12} sm={1} justifyContent="center" alignItems="center">
                            <div>
                                    <Link href={url}>
                                        <a>
                                            <Typography variant="h5">{name}</Typography>
                                        </a>
                                    </Link>
                                    <AnimatePresence initial={false}>
                                        <motion.div
                                            style = {{transformOrigin: "50%"}}
                                            animate={(url === props.currentPage) ? { scaleX: 1.1 } : { scaleX: 0 }}>
                                            <Underline />
                                        </motion.div>
                                    </AnimatePresence>
                                    </div>
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