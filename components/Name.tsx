import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Letter from "./Letter";
import Grid from "@mui/material/Grid";

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

function buildConfigs(name: string) {
	let configsList = [];
	let config = {};
	let letters = name.split("");
	configsList = letters.map((char, index) => {
		config = configSetup(char, index);
		return config;
	});
	return configsList;
}
function configSetup(char: string, index: number) {
	return {
		char: char,
		XOffsetEnter: randomArcPoint(38).x, //((index % 2) == 0) ? 25 : -25;
		YOffsetEnter: randomArcPoint(38).y, // ((index % 2) == 0) ? -75 : 75;
		enterDuration: 450,
		enterDelay: 3000
	};
}

function randomArcPoint(radius: number) {
	let theta = 2 * Math.random() * Math.PI;
	return { x: radius * Math.cos(theta), y: radius * Math.cos(theta) };
}

interface NameProps {
	firstName: string;
	lastName: string;
	startAnimation: boolean;
	onAnimationFinish: (status: boolean) => void;
}

export default function Name(props: NameProps) {
	const firstNameConfigs = useRef(buildConfigs(props.firstName));
	const lastNameConfigs = useRef(buildConfigs(props.lastName));
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		setTimeout(() => {
			props.onAnimationFinish(true);
		}, 3950);
	}, []);

	return (
		<>
			{isClient && (
				<StyledName container justifyContent="center" columnSpacing={2.5}>
					<Grid item style={{ display: "inline-block" }}>
						{props.firstName.split("").map((_: any, index: number) => (
							<Letter
								key={index}
								triggerNameEnter={props.startAnimation}
								{...(firstNameConfigs.current[index] as any)}
							/>
						))}
					</Grid>
					<Grid item style={{ display: "inline-block" }}>
						{props.lastName.split("").map((_: any, index: number) => (
							<Letter
								key={index + 7}
								triggerNameEnter={props.startAnimation}
								{...(lastNameConfigs.current[index] as any)}
							/>
						))}
					</Grid>
				</StyledName>
			)}
		</>
	);
}
