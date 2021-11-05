import React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import Letter from "./Letter.js";
import Grid from "@material-ui/core/Grid";

const StyledName = styled(Grid)`
    font-size: 56px;
    overflow: visible;
    display: flex;
    justify-content: center;
    position: relative;
    text-align: center;
    color: #264653;
    padding-top: 2%;
    margin-bottom: 0px;
}

`;
const StyledFirstName = styled(Grid)`
  display: inline-block;
  margin-right: 10px;
`;
const StyledLastName = styled(Grid)`
  display: inline-block;
  margin-left: 10px;
`;

class Name extends React.Component {
  constructor(props) {
    super(props);
    this.firstNameConfigs = this.buildConfigs(this.props.firstName, 0);
    this.lastNameConfigs = this.buildConfigs(this.props.lastName, 7);
  }
  buildConfigs(name, identifier) {
    let configsList = [];
    let config = {};
    let letters = name.split("");
    configsList = letters.map((char, index) => {
      config = this.configSetup(char, index, identifier);
      return config;
    });
    return configsList;
  }
  configSetup(char, index, identifier) {
    let config = {};
    config.char = char;
    config.XOffsetEnter = this.randomArcPoint(38).x; //((index % 2) == 0) ? 25 : -25;
    config.YOffsetEnter = this.randomArcPoint(38).y; // ((index % 2) == 0) ? -75 : 75;
    config.durationEnter = 500;

    config.XOffsetExit = 100;
    config.YOffsetExit = this.uniformRandom(-200, 200);
    config.durationExit = 900;
    config.delayExit = 100 * (index + identifier) + Math.random() * 600;
    return config;
  }
  uniformRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
  randomArcPoint = (radius) => {
    let theta = 2 * Math.random() * Math.PI;
    return { x: radius * Math.cos(theta), y: radius * Math.cos(theta) };
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isNameDone == true && nextProps.location == "/") {
      return false;
    } else {
      return true;
    }
  }
  render() {
    let animateNameOut = false; //(this.props.location != '/') && (this.props.nameEntered == true)
    return (
      <StyledName container justifyContent="center">
        <StyledFirstName item>
          {this.props.firstName.split("").map((_, index) => (
            <Letter
              key={index}
              animateNameOut={animateNameOut}
              setIsNameDone={this.props.setNameEntered}
              triggerNameEnter={this.props.triggerNameEnter}
              {...this.firstNameConfigs[index]}
            />
          ))}
        </StyledFirstName>
        <StyledLastName item>
          {this.props.lastName.split("").map((_, index) => (
            <Letter
              key={index + 7}
              animateNameOut={animateNameOut}
              setIsNameDone={this.props.setNameEntered}
              triggerNameEnter={this.props.triggerNameEnter}
              {...this.lastNameConfigs[index]}
            />
          ))}
        </StyledLastName>
      </StyledName>
    );
  }
}

export default Name;
