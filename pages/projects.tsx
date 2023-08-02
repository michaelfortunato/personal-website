import React from "react";
import Tile from "@components/Projects/Tile";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";
import clayiPhone from "@public/projects/clay-iphone.svg";
import clayMBP from "@public/projects/clay-mbp.svg";
import technologies from "@public/projects/technologies.svg";

export default function Projects() {
	return (
		<div style={{ height: "100vh", width: "100vw" }}>
			<Grid
				container
				alignItems="center"
				justifyContent="center"
				style={{ height: "100vh" }}
			>
				<Grid
					component={Paper}
					sx={{ borderRadius: 3, padding: 3, boxShadow: 3 }}
					container
					item
					xs={9}
				>
					<Grid item xs={6}>
						<Box sx={{ paddingTop: 4, paddingLeft: 4 }}>
							<Grid container spacing={6}>
								<Grid item xs={12}>
									<Typography variant="h2">Personal Website</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body1">
										Lorem ipsum dolor sit amet consectetur adipisicing elit.
										Tenetur fugit ea nemo, reiciendis perspiciatis dignissimos.{" "}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Image src={technologies} alt="clay-iphone.svgb" />
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid
						container
						sx={{ marginLeft: -8 }}
						item
						xs={6}
						spacing={5}
						alignItems={"center"}
					>
						<Grid item xs={3}>
							<Image src={clayiPhone} alt="clay-iphone.svgb" />
						</Grid>
						<Grid item xs={1} />
						<Grid item xs={2}>
							<Image src={clayMBP} alt="clay-mbp.svgb" />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}
