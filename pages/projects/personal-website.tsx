import { Box, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layout, TileFactory } from ".";
import Image from "next/image";
import clayiPhone from "@/public/projects/clay-iphone.svg";
import clayMBP from "@/public/projects/clay-mbp.svg";
import bundleSizes from "@/public/projects/personal-website/bundle-sizes.png";

export function Tile() {
	return <WebsiteTile />;
}

function WebsiteTile() {
	const leftHandSize = () => (
		<div className="container flex flex-col gap-4">
			<div className="text-base">
				This website is a public vault of my life, and there is heavy emphasis
				on intricate animations. It was built using NextJS. 10/18: I need a cool
				looking about section... The NYC train animation is good and I did have
				a timeline extending out of it using GSAP that I kinda liked but I
				should go back into Adobe Affect Effects and make something nicer
				looking. This is all too late for grad school apps. Too bad! TODO: I
				think what I should do is create a work in progress sign on the page
				just for presentation sake and get the blog set up. That should take
				about an evening.
			</div>
		</div>
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
	return TileFactory(
		"Personal Website",
		leftHandSize(),
		rightHandside(),
		"personal-website"
	);
}

export default function PersonalWebsite() {
	return (
		<Layout url="/projects/personal-website">
			<div className="flex justify-center">
				<h1 className="text-6xl">Personal Website</h1>
			</div>
			<div className="flex items-center flex-col gap-2 mt-4">
				<div className="prose">
					<p>
						What is there to say? This website has been around for years. It
						uses a bunch of different technologies, like NextJS, GSAP, raw CSS
						animations, Framer Motion, Tailwind CSS. The first page takes awhile
						to load. I think it has to do with all gsap stuff on the about page.
						I did a bundle analyzer.
					</p>
					<h2>Bundle Analysis</h2>
					<p>
						At first I blamed AWS cold starts. Indeed, the time to first load is
						the slow part, once that aws image is hot, my website loads quickly
						on my friends phone. Still, I know I am running Material UI,
						Tailwind CSS, GSAP, and Framer Motion, so there is alot of
						redundancy. I might experiment on the dev branch by removing the
						About page and seeing how the time to first byte fairs.
					</p>
					<div className="flex justify-center">
						<Image
							src={bundleSizes}
							width={600}
							height={600}
							alt="bundle size image"
						/>
					</div>
				</div>
			</div>
		</Layout>
	);
}
