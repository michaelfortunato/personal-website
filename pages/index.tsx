import React, { useState, useEffect } from "react";
import Grid from "@components/Grid";
import Hero from "@components/Hero";
import { AnimatePresence, motion } from "framer-motion";

const defaultGridConfig = {
	random: true,
	numLines: 12,
	offset: 0,
	avgDuration: 200,
	avgDelay: 1500,
	isDot: true
};

// Renders home page of a nextjs app (index.tsx)
export default function Home({ commitHash }: { commitHash: string }) {
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
			<div>The commit hash: {commitHash}</div>
		</>
	);
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
	let commitHash = "";

	if (process.env.VERCEL) {
		commitHash = process.env.VERCEL_GIT_COMMIT_SHA as string;
	}

	// By returning { props: { posts } }, the Blog component
	// will receive `posts` as a prop at build time
	return {
		props: {
			commitHash
		}
	};
}
