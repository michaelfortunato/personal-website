import React, { useMemo, useState } from "react";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import { BuildInfo, computeGithubURLs, getBuildInfo } from "lib/buildInfo";
import { GetStaticProps } from "next";
import { CodeXml, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NextPageWithLayout } from "./_app";
import RootPageLayout from "@/components/RootPageLayout";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const defaultGridConfig = {
	random: true,
	numLines: 12,
	offset: 0,
	avgDuration: 200,
	avgDelay: 1500,
	isDot: true
};

type Props = {
	buildInfo: BuildInfo;
};

const BuildInfo: React.FC<{ buildInfo: BuildInfo; triggerFadeIn: boolean }> = ({
	buildInfo: {
		commitInfo: { repo, hash, branch },
		buildTimestamp
	},
	triggerFadeIn
}) => {
	const [isOpen, setIsOpen] = useState(true);
	const { repoURL, commitURL, branchURL } = useMemo(
		() => computeGithubURLs({ repo, hash, branch }),
		[repo, hash, branch]
	);
	if (!isOpen) {
		return (
			<Button className="z-10" onClick={() => setIsOpen(true)}>
				<CodeXml className="z-10" />
			</Button>
		);
	}
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={triggerFadeIn && { opacity: 1 }}
			transition={{ type: "spring", duration: 7 }}
			className="flex justify-center md:justify-normal"
		>
			<div className="md:min-w-[25%] min-w-2/12 border-4 rounded border-dotted border-foreground p-8 pt-4 m-2">
				<h2 className="font-buildManifestHeading text-center text-4xl">
					Build Info
				</h2>
				<Separator className="my-2 bg-foreground" />
				<div className="flex flex-col gap-1">
					<div className="flex justify-between font-medium gap-x-6">
						<div className="uppercase italic">Commit Hash:</div>
						<div>
							<Link href={commitURL} target="_blank">
								{hash}
							</Link>
							<motion.div
								style={{ transformOrigin: "50%" }}
								initial={{ scaleX: 0 }}
								animate={
									triggerFadeIn && {
										scaleX: 0.1
									}
								}
								transition={{ delay: 2 }}
							>
								<hr className="border-foreground" />
							</motion.div>
						</div>
					</div>
					<div className="flex justify-between font-medium gap-x-6">
						<div className="uppercase italic">Branch:</div>
						<div>
							<Link href={branchURL} target="_blank">
								{branch}
							</Link>
							<motion.div
								style={{ transformOrigin: "50%" }}
								initial={{ scaleX: 0 }}
								animate={
									triggerFadeIn && {
										scaleX: 0.1
									}
								}
								transition={{ delay: 2 }}
							>
								<hr className="border-foreground" />
							</motion.div>
						</div>
					</div>
					<div className="flex justify-between font-medium gap-x-6">
						<div className="uppercase italic">Repo:</div>
						<div>
							<Link href={repoURL} target="_blank">
								{repo}
							</Link>
							<motion.div
								style={{ transformOrigin: "50%" }}
								initial={{ scaleX: 0 }}
								animate={
									triggerFadeIn && {
										scaleX: 0.1
									}
								}
								transition={{ delay: 2 }}
							>
								<hr className="border-foreground" />
							</motion.div>
						</div>
					</div>
					<div className="flex justify-between font-medium gap-x-6">
						<div className="uppercase italic">Build Timestamp:</div>
					</div>
					<div className="flex justify-between font-medium">
						<CornerDownRight strokeWidth={1.5} />
						<div>{buildTimestamp}</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

// Renders home page of a nextjs app (index.tsx)
const Page: NextPageWithLayout<Props> = ({ buildInfo }: Props) => {
	const [triggerNameEnter, setTriggerNameEnter] = useState(false);
	const [triggerGridExit, setTriggerGridExit] = useState(false);
	return (
		<>
			<AnimatePresence>
				{!triggerGridExit && (
					<motion.div
						exit={{ opacity: 0 }}
						transition={{ type: "spring", duration: 2 }}
					>
						<Grid
							setTriggerGridExit={setTriggerGridExit}
							setTriggerNameEnter={setTriggerNameEnter}
							{...defaultGridConfig}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<Hero triggerNameEnter={triggerNameEnter} />
			<Card className="absolute right-0 top-0">
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
			</Card>
			<div className="absolute bottom-0 left-0 w-full">
				<BuildInfo buildInfo={buildInfo} triggerFadeIn={triggerGridExit} />
			</div>
		</>
	);
};

Page.getLayout = page => {
	return <RootPageLayout>{page}</RootPageLayout>;
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async () => {
	// By returning { props: { posts } }, the Blog component
	// will receive `posts` as a prop at build time
	return {
		props: {
			buildInfo: await getBuildInfo()
		}
	};
};
export default Page;
