/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, {
	ReactElement,
	PropsWithChildren,
	useState,
	useRef,
	useEffect,
	ReactNode
} from "react";
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
import { Tile as EightBitAdderTile } from "./8-bit-adder";

export function TileFactory(
	title: string,
	leftHandComponent: ReactElement,
	rightHandComponent: ReactElement,
	link: string
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
				<motion.div animate={isOpen ? { opacity: 0 } : { opacity: 1 }}>
					<StyledTile>
						<div className="flex flex-col gap-5">
							<div className="flex">
								<div className="flex-1">
									<h2 className="text-5xl">{title}</h2>
								</div>
								<div className="flex-1 flex flex-row-reverse">
									<Link
										href={link}
										onClick={e => {
											setIsOpen(!isOpen);
											e.preventDefault();
											setTimeout(() => {
												router.push(`/projects/${link}`);
											}, 350);
										}}
									>
										<IconButton aria-label="View full">
											<FlipIcon />
										</IconButton>
									</Link>
								</div>
							</div>
							<div className="flex gap-1">
								<div className="flex-1">{leftHandComponent}</div>
								<div className="flex-1">{rightHandComponent}</div>
							</div>
						</div>
					</StyledTile>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

export function StyledTile({
	props,
	children
}: {
	props?: any;
	children: ReactNode;
}) {
	return (
		<div className="min-h-96 rounded p-3 shadow-md bg-neutral-50">
			{children}
		</div>
	);
}

export function Layout(props: PropsWithChildren<{ url: string }>) {
	const { url, children } = props;
	return (
		<div className="h-screen">
			<motion.div className="bg-neutral-50 p-10" layoutId="page">
				<div className="flex flex-row-reverse">{url}</div>
				<div>{children}</div>
			</motion.div>
		</div>
	);
}

export const wrap = (min: number, max: number, v: number) => {
	const rangeSize = max - min;
	return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function Projects() {
	const [selected, setSelected] = useState(0);
	const tiles = [<WebsiteTile />, <EightBitAdderTile />];
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
