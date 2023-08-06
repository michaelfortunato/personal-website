import React from "react";
import styled from "@emotion/styled";
import DescItem from "./DescItem.js";

const tags = [
	"Software Engineering",
	"Statistical Machine Learning",
	"Back-End Development",
	"Complexity Theory",
	"Full Stack Development",
	"Front-End Development"
];

const StyledDescription = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	color: #264653;
	font-size: 22px;

	opacity: 0;
	&.fade-in-appear,
	&.fade-in-enter {
		opactiy: 0;
	}
	&.fade-in-appear-active,
	&.fade-in-enter-active {
		opacity: 1;
		transition-property: all;
		transition-duration: 1500ms;
	}
	&.fade-in-appear-done,
	&.fade-in-enter-done {
		opacity: 1;
	}
`;

const Description = props => {
	const n = tags.length;

	const movePercentage = (1 / n) * 100;

	/* total time * 1/n = moveTime */
	/* => totalTime = moveTime * n */
	const moveTime = 2000; /* in ms */
	const totalTime = moveTime * n;
	const waitTime = moveTime;
	const aniTags = tags.map((tag, index) => (
		<DescItem
			key={index}
			tag={tag}
			movePercentage={movePercentage}
			totalTime={totalTime}
			delay={waitTime * index}
		/>
	));

	return <StyledDescription>{aniTags}</StyledDescription>;
};

export default Description;
