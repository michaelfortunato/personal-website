import React, { ReactElement } from "react";
import Tile from "@components/Projects/Tile";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import Image from "next/image";
import clayiPhone from "@public/projects/clay-iphone.svg";
import clayMBP from "@public/projects/clay-mbp.svg";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import FlipIcon from "@mui/icons-material/Flip";

function TileFactory(
	leftHandComponent: ReactElement,
	rightHandComponent: ReactElement
) {
	return (
		<Grid
			component={Paper}
			sx={{ borderRadius: 2, padding: 3, boxShadow: 3 }}
			container
			item
			xs={4}
		>
			<Grid container item xs={12} justifyContent={"right"}>
				<Grid xs="auto">
					<IconButton aria-label="View full">
						<FlipIcon />
					</IconButton>
				</Grid>
			</Grid>
			<Grid item xs={6}>
				{leftHandComponent}
			</Grid>
			<Grid container item xs={6} alignItems={"center"}>
				{rightHandComponent}
			</Grid>
		</Grid>
	);
}

function WebsiteTile() {
	const leftHandSize = () => (
		<Box sx={{ paddingTop: 4, paddingLeft: 4 }}>
			<Grid container spacing={6}>
				<Grid item xs={12}>
					<Typography variant="h2">Personal Website</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body1">
						Here is some filler text about Lycurgus. I wish I were more like
						him. Lycurgus (/ Greek: Λυκοῦργος Lykourgos; fl. c. 820 BC) was the
						legendary lawgiver of Sparta. He is credited with establishing the
						military-oriented reformation of Spartan society in accordance with
						the Oracle of Apollo at Delphi. All his reforms promoted the three
						Spartan virtues: equality (among citizens), military fitness, and
						austerity.
					</Typography>
				</Grid>
			</Grid>
		</Box>
	);
	const rightHandside = () => (
		<>
			<Grid item xs={3}>
				<Image src={clayiPhone} alt="clay-iphone.svgb" />
			</Grid>
			<Grid item xs={1} />
			<Grid item xs={2}>
				<Image src={clayMBP} alt="clay-mbp.svgb" />
			</Grid>
		</>
	);
	return TileFactory(leftHandSize(), rightHandside());
}

export default function Projects() {
	return (
		<Grid
			container
			alignItems="center"
			justifyContent="center"
			style={{ height: "100vh" }}
		>
			{WebsiteTile()}
		</Grid>
	);
}
