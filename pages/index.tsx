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
export default function Home() {
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
		</>
	);
}
