import React from "react";
import Tile from "@components/Projects/Tile";
import { Grid, Paper, Typography } from "@material-ui/core";
import Image from "next/image";

export default function Projects(props: any) {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh" }}
      >
        <Grid component={Paper} container item xs={9}>
          <Grid item xs={6}>
            <Typography variant="h1" style={{ color: "black" }}>
              Personal Website
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Image
              src="/projects/clay-iphone.svg"
              alt="placertexthere"
              width={50}
              height={50}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
