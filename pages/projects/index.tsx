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
	LayoutGroup,
	motion,
	useMotionValueEvent,
	useScroll
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	ArrowDownward,
	ArrowUpward,
	PreviewOutlined
} from "@mui/icons-material";

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

function TileFactory2(
	leftHandComponent: ReactElement,
	rightHandComponent: ReactElement
) {
	return (
		<Paper className="p-4">
			<div className="flex justify-end">
				<div className="flex-initial">
					<Link href={"personal-website"}>
						<IconButton aria-label="View full">
							<FlipIcon />
						</IconButton>
					</Link>
				</div>
			</div>
			<div className="flex gap-4">
				<div className="flex-1">{leftHandComponent}</div>
				<div className="flex-1">{rightHandComponent}</div>
			</div>
		</Paper>
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
		<div className="flex">
			<div className="flex-initial">
				<Image src={clayiPhone} alt="clay-iphone.svgb" />
			</div>
			<div className="flex-initial">
				<Image src={clayMBP} alt="clay-mbp.svgb" />
			</div>
		</div>
	);
	return TileFactory2(leftHandSize(), rightHandside());
}

export function Layout({ children }: PropsWithChildren<{}>) {
	return (
		<Grid
			container
			alignItems="center"
			justifyContent="center"
			style={{ height: "100vh", paddingLeft: 20, paddingRight: 20 }}
		>
			<Grid item xs={12}>
				<Paper component={motion.div} layoutId="page" sx={{ padding: 10 }}>
					{children}
				</Paper>
			</Grid>
		</Grid>
	);
}

function mod(n: number, m: number) {
	return ((n % m) + m) % m;
	// return n % m;
}

function Tile2(offset: number, prevOffset: number, base: number) {
	if (prevOffset + base == 1 && offset + base == 0) {
		<motion.div className="absolute" key={base}>
			<div
				css={css`
					top: -50vh;
					transform: translateY(-50%);
				`}
			>
				<WebsiteTile />
			</div>
		</motion.div>;
	} else if (prevOffset + base == 0 && offset + base == 1) {
		<motion.div className="absolute" key={base}>
			<div
				css={css`
					top: 150vh;
					transform: translateY(-50%);
				`}
			>
				<WebsiteTile />
			</div>
		</motion.div>;
	} else {
		return (
			<motion.div
				className="absolute"
				key={base}
				animate={{ y: `${mod(offset + base, 5) * 50 - 50}vh` }}
			>
				<div
					css={css`
						transform: translateY(-50%);
					`}
				>
					<WebsiteTile />
				</div>
			</motion.div>
		);
	}
}

export default function Projects() {
	const [offset, setOffset] = useState(0);
	const { scrollY } = useScroll();
	useMotionValueEvent(scrollY, "change", latest => {
		console.log("Page scroll: ", latest);
	});
	const prevOffset = useRef(0);
	console.log("----");
	console.log(prevOffset.current);
	console.log(offset);
	console.log("----");
	useEffect(() => {
		prevOffset.current = offset;
	}, [offset]);

	return (
		<div className="flex overflow-hidden">
			<div className="flex-1" />
			<div className="flex-initial container relative">
				<LayoutGroup>
					{[...Array(5).keys()].map((i: number) => {
						return Tile2(prevOffset.current, offset, i);
					})}
				</LayoutGroup>
			</div>
			<div className="flex-1">
				<div className="flex flex-col justify-center items-center h-[100vh]">
					<div className="flex-initial">
						<IconButton
							onClick={() => {
								if (offset - 1 < 0) {
									setOffset(4);
								} else {
									setOffset((offset - 1) % 5);
								}
							}}
						>
							<ArrowUpward />
						</IconButton>
					</div>
					<div className="flex-initial">
						<IconButton
							onClick={() => {
								setOffset((offset + 1) % 5);
							}}
						>
							<ArrowDownward />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	);
}
