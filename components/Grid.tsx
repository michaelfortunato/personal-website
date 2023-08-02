import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import UAParser from "ua-parser-js";
import Gridline from "./Gridline";

const MIN_DURATION = 250;
const MIN_DELAY = 300 + 1000;

const StyledGrid = styled(motion.div)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 1;
	overflow: hidden;
`;

function timing(
	avgDuration: number,
	avgDelay: number,
	randomize: boolean = false
) {
	const duration = MIN_DURATION + avgDuration * (false ? Math.random() : 1);
	const delay = MIN_DELAY + avgDelay * (randomize ? Math.random() : 1); // avgDelay + 200 * randn_bm();
	return { duration, delay };
}

export default function Grid(props: any) {
	const [rowConfigs, setRowConfigs] = useState<
		| {
				isDot: boolean;
				duration: number;
				delay: number;
				fixedPos: any;
				floatingPos: number;
		  }[]
		| null
	>(null);
	const [colConfigs, setColConfigs] = useState<
		| {
				isDot: boolean;
				duration: number;
				delay: number;
				fixedPos: any;
				floatingPos: number;
		  }[]
		| null
	>(null);
	const [numColLines, setNumColLines] = useState(1);
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [browser, setBrowser] = useState<UAParser.IBrowser | null>(null);

	const numRowLines = props.numLines;
	const spacing = Math.floor(100 / numRowLines);

	const position = (
		i: any,
		isRow: any,
		broswerName: any,
		width: any,
		height: any
	) => {
		let fixedPos = props.offset + spacing * i;
		if (broswerName.toLowerCase() === "firefox" && !isRow) {
			fixedPos = (height / width) * fixedPos;
		}
		const floatingPos = 100 * (props.random ? Math.random() : 0);
		return { fixedPos, floatingPos };
	};

	const configuration = (
		i: number,
		isRow: boolean,
		browserName: string,
		width: number,
		height: number
	) => {
		const pos_conf = position(i, isRow, browserName, width, height);
		const time_conf = timing(props.avgDuration, props.avgDelay, props.random);
		return { ...pos_conf, ...time_conf, isDot: true };
	};

	useEffect(() => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const rconfigs: any = {}; // Hashmap
		const cconfigs: any = {}; // Hashmap
		const nrlines = props.numLines;
		const nclines = Math.floor((width / height) * props.numLines + 1);
		let gridEnterTimeout = 0;
		const UAObject = UAParser(window.navigator.userAgent);
		setBrowser(UAObject.browser);
		for (let i = 1; i <= nrlines; ++i) {
			rconfigs[i] = configuration(
				i,
				true,
				// We can asssert the type here because useEffect gets triggered on after mount
				UAObject.browser.name as string,
				width,
				height
			);
			gridEnterTimeout = Math.max(
				gridEnterTimeout,
				rconfigs[i].duration + rconfigs[i].delay
			);
		}
		for (let i = 1; i <= nclines; ++i) {
			cconfigs[i] = configuration(
				i,
				false,
				// We can asssert the type here because useEffect gets triggered on after mount
				UAObject.browser.name as string,
				width,
				height
			);
			gridEnterTimeout = Math.max(
				gridEnterTimeout,
				cconfigs[i].duration + cconfigs[i].delay
			);
		}

		setNumColLines(nclines);
		setRowConfigs(rconfigs);
		setColConfigs(cconfigs);
		setWidth(width);
		setHeight(height);

		setTimeout(() => props.setTriggerNameEnter(true), gridEnterTimeout);
		setTimeout(() => props.setTriggerGridExit(true), gridEnterTimeout + 250);
	}, []);

	console.log(`WIDTH: ${width}`);
	console.log(`HEIGHT: ${height}`);

	return (
		<>
			{width !== 0 && height !== 0 && (
				<StyledGrid>
					{[...Array(numRowLines)].map((_, i) => (
						<Gridline
							key={i}
							browser={browser}
							isRow
							width={width}
							height={height}
							// We can assert this as non null because of the
							// width and height guard above
							{...(rowConfigs[i + 1] as {
								isDot: boolean;
								duration: number;
								delay: number;
								fixedPos: any;
								floatingPos: number;
							})}
						/>
					))}
					{[...Array(numColLines)].map((_, i) => (
						<Gridline
							key={i + props.numLines}
							browser={browser}
							isRow={false}
							width={width}
							height={height}
							{...colConfigs[i + 1]}
						/>
					))}
				</StyledGrid>
			)}
		</>
	);
}
