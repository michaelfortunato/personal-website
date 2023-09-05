import { Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layout } from ".";

//
export default function PersonalWebsite() {
	return (
		<Layout>
			<Link href="/projects">
				<motion.h1 layout="position">Expanded</motion.h1>
			</Link>
		</Layout>
	);
}
