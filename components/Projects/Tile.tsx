import React, { ReactComponentElement } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

import { ReactElement } from "react";

export default function TileFactory(
	leftHandComponent: ReactElement,
	rightHandComponent: ReactElement
) {
	return (
		<Grid
			component={Paper}
			sx={{ borderRadius: 3, padding: 3, boxShadow: 3 }}
			container
			item
			xs={4}
		>
			<Grid item xs={6}></Grid>
			<Grid container item xs={6} alignItems={"center"}>
				{rightHandComponent}
			</Grid>
		</Grid>
	);
}
