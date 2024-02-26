/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, {
	ReactElement,
	PropsWithChildren,
	useState,
	useRef,
	useEffect
} from "react";
import Tile from "@components/Projects/Tile";
import { css } from "@emotion/react";
import {
	Backdrop,
	Box,
	Button,
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
import {
	AnimatePresence,
	LayoutGroup,
	motion,
	useMotionValueEvent,
	useScroll,
	useSpring
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	ArrowDownward,
	ArrowUpward,
	PreviewOutlined
} from "@mui/icons-material";
import { Tile as WebsiteTile } from "./personal-website";

export function TileFactory(
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
								<Grid item xs="auto">
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

export function Layout(props: PropsWithChildren<{ url: string }>) {
	const { url, children } = props;
	return (
		<div
			className="flex flex-col justify-center items-center container"
			style={{ height: "100vh", paddingLeft: 20, paddingRight: 20 }}
		>
			<div>
				<Paper component={motion.div} layoutId="page" sx={{ padding: 10 }}>
					<div className="flex flex-row-reverse">{url}</div>
					<div>{children}</div>
				</Paper>
			</div>
		</div>
	);
}

function BlogTile() {
	return (
		<div className="flex justify-center">
			<Typography variant="h2"> Blog</Typography>
		</div>
	);
}

export default function Projects() {
	const [selected, setSelected] = useState(0);
	const tiles = [<WebsiteTile />, <BlogTile />];
	const numTiles = tiles.length;

	return (
		<div className="flex overflow-hidden">
			<div className="flex-1" />
			<div className="flex-[2] flex flex-col justify-center">
				<AnimatePresence initial={false} mode="wait">
					<motion.div
						className="container"
						key={selected}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{tiles[selected]}
					</motion.div>
				</AnimatePresence>
			</div>
			<div className="flex-1">
				<div className="flex flex-col justify-center items-center h-[100vh]">
					<div className="flex-initial">
						<IconButton
							disabled={selected == numTiles - 1}
							onClick={() => setSelected(selected + 1)}
						>
							<ArrowUpward />
						</IconButton>
					</div>
					<div className="flex-initial">
						<IconButton
							disabled={selected == 0}
							onClick={() => setSelected(selected - 1)}
						>
							<ArrowDownward />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	);
}
