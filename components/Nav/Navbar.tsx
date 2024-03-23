import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Twirl as Hamburger } from "hamburger-react";
import { gsap } from "gsap";

export default function Navbar(props: any) {
	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {}, []);
	return (
		<div className="fixed z-50">
			<div className="text-white p-6 fixed z-[1] inline-block">
				<div>
					<Hamburger
						duration={0.2}
						toggled={isVisible}
						toggle={() => setIsVisible(!isVisible)}
					/>
				</div>
			</div>
			<NavPage
				routes={props.routes}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
			/>
		</div>
	);
}

const NavContent = (props: any) => {
	const navContentRef = useRef(null);
	const linksQuery = gsap.utils.selector(navContentRef);
	useEffect(() => {
		const links = linksQuery(".links");
		gsap.fromTo(
			links,
			{ x: -400, y: -200, rotation: 30 },
			{ x: 0, y: 0, rotation: 0, delay: 0.2, duration: 0.3, stagger: 0.08 }
		);
	}, []);
	return (
		<div ref={navContentRef} className="h-full flex">
			<div className=" h-full flex-1 md:flex-[4] flex flex-col justify-center items-center gap-16">
				{Object.entries(props.routes).map(([url, { name }]) => (
					<div className="links" key={url}>
						<motion.div
							animate={{
								color:
									props.previewUrl !== null
										? props.routes[props.previewUrl].previewTextColor
										: "#FFFFFF"
							}}
							transition={{ color: { duration: 1 } }}
							onMouseOver={() => props.setPreviewUrl(url)}
							onMouseLeave={() => props.setPreviewUrl(null)}
							onClick={() => props.setIsVisible(false)}
							style={{ display: "inline-block" }}
						>
							<Link href={url}>
								<motion.h2
									// className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
									className="text-7xl"
									animate={{
										scale: url === props.previewUrl ? 1 : 1,
										translateX: url === props.previewUrl ? "10px" : 0,
										translateY: url === props.previewUrl ? "-10px" : 0
									}}
								>
									{name}
								</motion.h2>
							</Link>
							<AnimatePresence initial={false}>
								<motion.div
									style={{ transformOrigin: "50%" }}
									animate={{
										scaleX: url === props.previewUrl ? 1.1 : 0
									}}
								>
									<hr className="h-[2px] bg-white" />
								</motion.div>
							</AnimatePresence>
						</motion.div>
					</div>
				))}
			</div>
			<div className="md:flex-[8]" />
		</div>
	);
};

const NavPage = (props: any) => {
	const [previewUrl, setPreviewUrl] = useState<null | string>(null);
	return (
		<AnimatePresence initial={false}>
			{props.isVisible && (
				<motion.div
					className="relative top-0 left-0 w-screen h-screen"
					style={{ originY: 0, backgroundColor: "#49474d" }}
					initial={{ translateY: "-100%" }}
					animate={{
						backgroundColor:
							previewUrl !== null
								? props.routes[previewUrl].previewColor
								: "rgba(73, 71, 77, 1)",
						translateY: 0,
						transition: { duration: 0.5 }
					}}
					exit={{ translateY: "-100%", transition: { duration: 0.5 } }}
				>
					<NavContent
						routes={props.routes}
						setIsVisible={props.setIsVisible}
						previewUrl={previewUrl}
						setPreviewUrl={setPreviewUrl}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
