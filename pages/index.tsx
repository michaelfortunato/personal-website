import React, { useState, useEffect } from "react";
import Grid from "@components/Grid";
import Hero from "@components/Hero";
import { AnimatePresence, motion } from "framer-motion";

const defaultGridConfig = {
	random: true,
	numLines: 12,
	offset: 0,
	avgDuration: 150,
	avgDelay: 1500,
	duration: 750,
	isDot: true
};

// Renders home page of a nextjs app (index.tsx)
export default function Home() {
	const [gridEntered, setGridEntered] = useState(false);
	const [triggerNameEnter, setTriggerNameEnter] = useState(false);
	const [triggerGridExit, setTriggerGridExit] = useState(false);
	return (
		<Grid
			setTriggerGridExit={setTriggerGridExit}
			setTriggerNameEnter={setTriggerNameEnter}
			{...defaultGridConfig}
		/>
	);
}
