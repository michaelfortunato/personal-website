import { motion } from "framer-motion";

export default function Letter(props: {
	key: number;
	XOffsetEnter: number;
	YOffsetEnter: number;
	enterDuration: number;
	triggerNameEnter: boolean;
	enterDelay: number;
	char: string;
}) {
	return (
		<motion.span
			className="relative inline-block"
			layout
			initial={{
				transform: `translate(${props.XOffsetEnter}vw, ${props.YOffsetEnter}vh)`
			}}
			animate={{
				transform: `translate(0, 0)`
			}}
			transition={{
				duration: props.enterDuration / 1000,
				delay: props.enterDelay / 1000
			}}
		>
			{props.char}
		</motion.span>
	);
}
