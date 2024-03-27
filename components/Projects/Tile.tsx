import React, { ReactComponentElement, useState } from "react";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";

import { ReactElement } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";
import FlipIcon from "@mui/icons-material/Flip";

export function TileFactory(
  leftHandComponent: ReactElement,
  rightHandComponent: ReactElement,
) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <motion.div style={{ perspective: "40rem" }}>
      <motion.div
        style={{
          top: 0,
          left: 0,
        }}
        layoutId="page"
        initial={false}
        animate={isOpen ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Paper sx={{ borderRadius: 2, padding: 3, boxShadow: 3 }}>
          <motion.div
            initial={false}
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          >
            <Grid container>
              <Grid container item xs={12} justifyContent={"right"}>
                <Grid item xs="auto">
                  <Link
                    href={"personal-website"}
                    onClick={(e) => {
                      setIsOpen(!isOpen);
                      e.preventDefault();
                      setTimeout(() => {
                        router.push("/projects/personal-website");
                      }, 350);
                    }}
                  >
                    <IconButton aria-label="View full">
                      <FlipIcon />
                    </IconButton>
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                {leftHandComponent}
              </Grid>
              <Grid container item xs={6} alignItems={"center"}>
                {rightHandComponent}
              </Grid>
            </Grid>
          </motion.div>
        </Paper>
      </motion.div>
    </motion.div>
  );
}
