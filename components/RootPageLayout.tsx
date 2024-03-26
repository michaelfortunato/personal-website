import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Navbar from "./Nav/Navbar";

export type RootPageStyle = {
	name: string;
	previewColor: string;
	previewTextColor: string;
	backgroundColor: string;
};

const pageConfigs: Record<string, RootPageStyle> = {
	"/": {
		name: "Home",
		previewColor: "rgba(230, 175, 75, 1)",
		previewTextColor: "#264653",
		backgroundColor: "#e6af4b"
	},
	"/about": {
		name: "About",
		previewColor: "rgba(20, 33, 61, 1)",
		previewTextColor: "#e6af4b",
		backgroundColor: "#14213D"
	},
	"/projects": {
		name: "Projects",
		previewColor: "#D5E5E5",
		previewTextColor: "#e6af4b",
		backgroundColor: "#D5E5E5"
	},
	"/blog": {
		name: "Blog",
		previewColor: "#14213D",
		previewTextColor: "#e6af4b",
		backgroundColor: "#14213D"
	}
};

export default function RootPageLayout({ children }: PropsWithChildren) {
	const router = useRouter();
	const pathname = router.pathname;
	const pageStyleConfig = pathname
		? pageConfigs[pathname] ?? pageConfigs["/"]
		: pageConfigs["/"];

	return (
		<>
			<Navbar routes={pageConfigs} />
			<motion.div
				className="absolute min-h-screen min-w-[100vw]"
				animate={{
					backgroundColor: pageStyleConfig.backgroundColor,
					transition: {
						duration: 0.5 // Yeah? Or 0.3 it matters!
					}
				}}
			>
				{children}
			</motion.div>
		</>
	);
}
