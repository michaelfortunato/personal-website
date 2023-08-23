import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
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

	const numRowLines = props.numLines;
	const spacing = 100 / numRowLines;

	const position = (
		i: any,
		isRow: any,
		width: any,
		height: any,
		spacing: number
	) => {
		let new_spacing = isRow ? spacing : (height / width) * spacing;
		let fixedPos = props.offset + new_spacing * i;
		const floatingPos = 100 * (props.random ? Math.random() : 0);
		return { fixedPos, floatingPos };
	};

	const configuration = (
		i: number,
		isRow: boolean,
		width: number,
		height: number
	) => {
		const pos_conf = position(i, isRow, width, height, spacing);
		const time_conf = timing(props.avgDuration, props.avgDelay, props.random);
		return { ...pos_conf, ...time_conf, isDot: true };
	};

	useEffect(() => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const rconfigs: any = {};
		const cconfigs: any = {};
		const nrlines = props.numLines;
		const nclines = Math.floor((width / height) * props.numLines) + 1;
		let gridEnterTimeout = 0;
		for (let i = 1; i <= nrlines; ++i) {
			rconfigs[i] = configuration(i, true, width, height);
			gridEnterTimeout = Math.max(
				gridEnterTimeout,
				rconfigs[i].duration + rconfigs[i].delay
			);
		}
		for (let i = 1; i <= nclines; ++i) {
			cconfigs[i] = configuration(i, false, width, height);
			gridEnterTimeout = Math.max(
				gridEnterTimeout,
				cconfigs[i].duration + cconfigs[i].delay
			);
		}
		const bingLiao = (width: number, height: number, numRows: number) => {
			let deltaPx = height / numRows;
			// 1px is equal to how many vh?
			let deltaVh = (deltaPx * 100) / height;
			// 1px is equal to how many vw?
			let deltaVw = (deltaPx * 100) / width;
			let numCols = Math.floor(width / deltaPx) + 1;
		};

		setNumColLines(nclines);
		setRowConfigs(rconfigs);
		setColConfigs(cconfigs);
		setWidth(width);
		setHeight(height);

		setTimeout(() => props.setTriggerNameEnter(true), gridEnterTimeout);
		setTimeout(() => props.setTriggerGridExit(true), gridEnterTimeout + 250);
	}, []);

	console.log(width);

	return (
		<>
			{width !== 0 && height !== 0 && (
				<StyledGrid>
					{[...Array(numRowLines)].map((_, i) => (
						<Gridline
							key={i}
							isRow
							width={width}
							height={height}
							// We can assert this as non null because of the
							// width and height guard above
							{...(
								rowConfigs as {
									isDot: boolean;
									duration: number;
									delay: number;
									fixedPos: any;
									floatingPos: number;
								}[]
							)[i + 1]}
						/>
					))}
					{[...Array(numColLines)].map((_, i) => (
						<Gridline
							key={i + props.numLines}
							isRow={false}
							width={width}
							height={height}
							{...(
								colConfigs as {
									isDot: boolean;
									duration: number;
									delay: number;
									fixedPos: any;
									floatingPos: number;
								}[]
							)[i + 1]}
						/>
					))}
				</StyledGrid>
			)}
		</>
	);
}
