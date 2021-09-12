import React from 'react';
import Description from './Description.js';
import Name from './Name.js';
import styled from 'styled-components';
import Grid from "@material-ui/core/Grid";
const StyledBanner = styled.div`
    position: relative;
    top: 16%;

`;
class Hero extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nameEntered: false }
        this.setNameEntered = this.setNameEntered.bind(this); //The line behind will bind the "this" keyword to an object of this class, rather than an object of the child class.
    }
    setNameEntered() {
        this.setState({ nameEntered: true });
    }

    render() {
        return (
            <Grid container style={{ "height": "90vh" }} justifyContent = "center" alignItems="center">
                <Grid item style = {{maxWidth:700}}>
                    <StyledBanner>
                        <Name firstName='Mike'
                            lastName='Fortunato'
                            triggerNameEnter={this.props.triggerNameEnter}
                            nameEntered={this.state.nameEntered}
                            setNameEntered={this.setNameEntered}
                            location={this.props.location}
                        />
                        {this.state.nameEntered ? <Description /> : null}
                    </StyledBanner>
                </Grid>
            </Grid>
        );
    }
}


export default Hero;