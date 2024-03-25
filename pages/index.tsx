import React, { useState } from "react";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import { BuildInfo, getBuildInfo } from "lib/buildInfo";
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

const BuildInfo: React.FC<{ buildInfo: BuildInfo }> = ({ buildInfo }) => {
	const [isOpen, setIsOpen] = useState(true);
	if (!isOpen) {
		return (
			<Button className="z-10" onClick={() => setIsOpen(true)}>
				<CodeXml className="z-10" />
			</Button>
		);
	}
	return (
		<div className="flex justify-center md:justify-normal">
			<div className="w-full md:w-2/12 border-2 rounded border-dashed border-foreground p-8 pt-2 m-2">
				<h2 className="font-buildManifestHeading text-center text-4xl">
					Build Info
				</h2>
				<Separator className="my-2 h-1 bg-foreground" />
				<div className="flex flex-col gap-1">
					<div className="flex justify-between font-medium">
						<div className="uppercase italic">Commit Hash:</div>
						<div>{buildInfo.commitInfo.hash}</div>
					</div>
					<div className="flex justify-between font-medium">
						<div className="uppercase italic">Branch:</div>
						<div>{buildInfo.commitInfo.branch}</div>
					</div>
					<div className="flex justify-between font-medium">
						<div className="uppercase italic">Commit Hash:</div>
						<div>{buildInfo.commitInfo.hash}</div>
					</div>
					<div className="flex justify-between font-medium">
						<div className="uppercase italic">Repo:</div>
						<div>{buildInfo.commitInfo.repo}</div>
					</div>
					<div className="flex justify-between font-medium">
						<div className="uppercase italic">Build Timestamp:</div>
					</div>
					<div className="flex justify-between font-medium">
						<CornerDownRight strokeWidth={1.5} />
						<div>{buildInfo.buildTimestamp}</div>
					</div>
				</div>
			</div>
		</div>
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
				<BuildInfo buildInfo={buildInfo} />
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
