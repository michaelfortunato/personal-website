import React, { useState } from "react";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import { BuildInfo, getBuildInfo } from "lib/buildInfo";
import { GetStaticProps } from "next";
import { CodeXml } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NextPageWithLayout } from "./_app";
import RootPageLayout from "@/components/RootPageLayout";

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
	const [isOpen, setIsOpen] = useState(false);
	if (!isOpen) {
		return (
			<Button className="z-10" onClick={() => setIsOpen(true)}>
				<CodeXml className="z-10" />
			</Button>
		);
	}
	return (
		<div>
			<div>The commit hash: {buildInfo.commitInfo.hash}</div>
			<div>The commit branch: {buildInfo.commitInfo.branch}</div>
			<div>The commit repo: {buildInfo.commitInfo.repo}</div>
			<div>The build Timestamp: {buildInfo.buildTimestamp}</div>
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
			<div className="absolute bottom-0 right-0">
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
