import React, { ReactElement, PropsWithChildren, useState } from "react";
import Tile from "@components/Projects/Tile";
import {
	Backdrop,
	Box,
	Grid,
	IconButton,
	Paper,
	Typography
} from "@mui/material";
import Image from "next/image";
import clayiPhone from "@public/projects/clay-iphone.svg";
import clayMBP from "@public/projects/clay-mbp.svg";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import FlipIcon from "@mui/icons-material/Flip";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

function TileFactory(
	leftHandComponent: ReactElement,
	rightHandComponent: ReactElement
) {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	return (
		<motion.div style={{ perspective: "40rem" }}>
			<motion.div
				style={{
					top: 0,
					left: 0
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
								<Grid xs="auto">
									<Link
										href={"personal-website"}
										onClick={e => {
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

function WebsiteTile() {
	const leftHandSize = () => (
		<Box sx={{ paddingLeft: 4 }}>
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

export function Layout({ children }: PropsWithChildren<{}>) {
	return (
		<div style={{ padding: "30px", overflowX: "hidden" }}>
			<Paper
				style={{ minHeight: "100vh" }}
				component={motion.div}
				layoutId="page"
			>
				{children}
			</Paper>
		</div>
	);
}

export default function Projects() {
	return (
		<Grid
			container
			alignItems="center"
			justifyContent="center"
			style={{ height: "100vh" }}
		>
			<Grid item lg={4} md={4} xs={12}>
				{WebsiteTile()}
			</Grid>
		</Grid>
	);
}
