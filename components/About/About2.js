import { useState, useEffect, useRef } from "react";
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography";
import styled from "styled-components"
import { motion } from "framer-motion"
import Divider from "@material-ui/core/Divider"

const StyledPage = styled(motion.div)`
    width: 100vw;
    overflow: hidden;
    height: 400vh;
    width: 100vw;
    position: relative;
`
const BlackTypography = styled(Typography)`
    color: black;
`
const ContentBoxContainer = styled.div`
	position: absolute;
	left: ${props => props.x}%;
	top: ${props => props.y}%;
`
const ContentBox = (props) => (
	<ContentBoxContainer ref={props.boxRef} x={props.x} y={props.y}>
		<Paper >
			<Grid container style={{ width: '20vw' }} justify="center" spacing={2}>
				<Grid item xs={12} >
					<BlackTypography variant={"h4"}>
						{props.title}
					</BlackTypography>
					<Divider />
				</Grid>
				<Grid item xs={10}>
					<BlackTypography>
						{props.body}
					</BlackTypography>
				</Grid>
			</Grid>
		</Paper>
	</ContentBoxContainer>

)
const ContentBoxes = [{
	title: "Beginnings",
	body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sagittis odio quam, eu cursus orci ullamcorper eget. Vestibulum justo tortor, posuere sed ullamcorper non, molestie condimentum libero. Praesent nulla erat, consequat eu lacus non, egestas dignissim lorem. Vivamus sollicitudin, lorem eget consequat commodo, quam diam vehicula ipsum, ut euismod augue lorem lobortis dui. Nullam semper mattis leo. Phasellus porttitor sodales mauris, eu vehicula odio ullamcorper a. Suspendisse ex ante, scelerisque non luctus eget, dignissim at justo. Integer a diam nulla. Phasellus fermentum odio eu enim ultrices, rutrum lacinia ex pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare gravida mollis. Nullam sit amet vulputate tortor. Nulla non nisl eu tellus placerat lobortis. Sed at ligula ut ligula ullamcorper consectetur. Phasellus ultrices justo eu neque sagittis, quis vehicula sem ullamcorper.",
	x: 5,
	y: 10,
	ld: "1074.98 181.12 804.5 183.65 648.5 295.65 297.38 292.28",
	ad: "M904,291.5c31.35-11.29,70.29-30.7,94.52-51.41L979.1,292.22l18.42,52.48C973.69,323.53,935.13,303.38,904,291.5Z",
	cd: "M1764,181a17,17,0,1,1-17-17A17,17,0,0,1,1764,181Z",
}, {
	title: "Youth",
	body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sagittis odio quam, eu cursus orci ullamcorper eget. Vestibulum justo tortor, posuere sed ullamcorper non, molestie condimentum libero. Praesent nulla erat, consequat eu lacus non, egestas dignissim lorem. Vivamus sollicitudin, lorem eget consequat commodo, quam diam vehicula ipsum, ut euismod augue lorem lobortis dui. Nullam semper mattis leo. Phasellus porttitor sodales mauris, eu vehicula odio ullamcorper a. Suspendisse ex ante, scelerisque non luctus eget, dignissim at justo. Integer a diam nulla. Phasellus fermentum odio eu enim ultrices, rutrum lacinia ex pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare gravida mollis. Nullam sit amet vulputate tortor. Nulla non nisl eu tellus placerat lobortis. Sed at ligula ut ligula ullamcorper consectetur. Phasellus ultrices justo eu neque sagittis, quis vehicula sem ullamcorper.",
	x: 5,
	y: 10,
	ld: "1074.32 369.4 1357.5 191.65 1782.62 195.11",
	ad: "M2522,195.5c-31.33,11.34-70.25,30.8-94.44,51.55l19.34-52.16-18.49-52.46C2452.26,163.57,2490.86,183.67,2522,195.5Z",
	cd: "M1761.47,356.41c13.87,18.22-6.72,38.81-24.94,24.94C1722.66,363.13,1743.25,342.53,1761.47,356.41Z"
},
{
	title: "Youth",
	body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sagittis odio quam, eu cursus orci ullamcorper eget. Vestibulum justo tortor, posuere sed ullamcorper non, molestie condimentum libero. Praesent nulla erat, consequat eu lacus non, egestas dignissim lorem. Vivamus sollicitudin, lorem eget consequat commodo, quam diam vehicula ipsum, ut euismod augue lorem lobortis dui. Nullam semper mattis leo. Phasellus porttitor sodales mauris, eu vehicula odio ullamcorper a. Suspendisse ex ante, scelerisque non luctus eget, dignissim at justo. Integer a diam nulla. Phasellus fermentum odio eu enim ultrices, rutrum lacinia ex pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare gravida mollis. Nullam sit amet vulputate tortor. Nulla non nisl eu tellus placerat lobortis. Sed at ligula ut ligula ullamcorper consectetur. Phasellus ultrices justo eu neque sagittis, quis vehicula sem ullamcorper.",
	x: 5,
	y: 10,
	ld: "1074.32 369.4 1357.5 191.65 1782.62 195.11",
	ad: "M2522,195.5c-31.33,11.34-70.25,30.8-94.44,51.55l19.34-52.16-18.49-52.46C2452.26,163.57,2490.86,183.67,2522,195.5Z",
	cd: "M1761.47,356.41c13.87,18.22-6.72,38.81-24.94,24.94C1722.66,363.13,1743.25,342.53,1761.47,356.41Z"
},

]
const SVGLine = (props) => {
	return (
		<g id={props.id} data-name={props.id}>
			<path id={`circle-${props.id}`} class="cls-2" d={props.cd} transform="translate(-673 0.15)" />
			<g>
				<polyline class="cls-3" points={props.ld} />
				<path class="cls-4" d={props.ad} />
			</g>
		</g>)
}



const VIEWBOX_WIDTH = 2365.94;
const VIEWBOX_HEIGHT = 2162.15;

export default function About2(props) {
	const [pageWidth, setPageWidth] = useState(0);
	const [pageHeight, setPageHeight] = useState(0);
	const pageRef = useRef(null);
	const contentBoxRefs = ContentBoxes.map(() => useRef(null));

	const percentToSVGX = (x, cRef) => (
		cRef.current !== null ? VIEWBOX_WIDTH / 100 * (x + cRef.current.offsetWidth / pageWidth * 100) : 0
	)
	const percentToSVGY = (y, cRef) => (
		cRef.current !== null ? VIEWBOX_HEIGHT / 100 * (y + cRef.current.offsetHeight / pageHeight * 50) : 0
	)
	useEffect(() => {
		setPageWidth(pageRef.current.offsetWidth)
		setPageHeight(pageRef.current.offsetHeight)
	}, [])
	console.log(ContentBoxes[0].x)
	return (
		<StyledPage ref={pageRef}>
			{ContentBoxes.map((props, i) => <ContentBox boxRef={contentBoxRefs[i]} {...props} />)}
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"  height="100%" width = "100%"
				viewBox="0 0 3658.6 6486.5" >
			
				<path id="RedLine_4_" class="st0" d="M1728.4,0v101.8l-66.8,43.2v4.1V809l150,224.6l2.6,1942.7" />
				<path id="FR" class="st1" d="M1807,2976.3l1571.9,266.9l-2.6,2536.8" />
				<path id="NL" class="st2" d="M1820.9,2976.3l-503.4,210.9l-2.6,2592.8" />
				<path id="NR" class="st3" d="M1820.9,2976.3l489.4,210.9l-2.6,2592.8" />
				<path id="FL" class="st4" d="M1838.7,2973.3L249,3243.2l-2.6,2536.8" />
				<g id="Main">
					<g id="_1">
						<path id="circle11956" class="st5" d="M1677.9,228.7c0,9.4-7.3,17-16.3,17c-9,0-16.3-7.6-16.3-17s7.3-17,16.3-17l0,0
			C1670.6,211.7,1677.9,219.4,1677.9,228.7z"/>
						<g>
							<polyline class="st6" points="1659.5,228.7 1399.8,231.2 1250,343.2 913,6486 			" />
							<path class="st7" d="M849.2,339.2c30-11.3,67.5-30.7,90.7-51.4l-18.6,52.1l17.7,52.5C916.1,371.3,879.1,351.1,849.2,339.2z" />
						</g>
					</g>
					<g id="_2">
						<path id="circle11956-2" class="st5" d="M1672.9,404.2c13.9,18.2-6.7,38.8-24.9,24.9C1634.2,410.9,1654.6,390.3,1672.9,404.2z" />
						<g>
							<polyline class="st6" points="1658.8,417 1930.7,239.2 2338.8,242.7 			" />
							<path class="st7" d="M2402.5,243.2c-30,11.3-67.4,30.8-90.6,51.6l18.5-52.2l-17.8-52.5C2335.6,211.3,2372.7,231.4,2402.5,243.2z"
							/>
						</g>
					</g>
					<g id="_3">
						<path id="circle11956-3" class="st5" d="M1676.5,605.3c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17S1676.5,595.9,1676.5,605.3
			L1676.5,605.3z"/>
						<g>
							<path class="st6" d="M1658.5,605.1l-150.4-94.8l-291.1,7.4l-160,80.1c-9.1,4.6-19.2,7-29.3,7H741.1" />
							<path class="st7" d="M677.4,604.8c30-11.6,67.2-31.4,90.2-52.3l-18.1,52.3l18.1,52.3C744.6,636.1,707.3,616.4,677.4,604.8z" />
						</g>
					</g>
					<g id="_5">
						<path id="circle11956-4" class="st5" d="M1770.3,949.4c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1762.7,932.4,1770.3,940.1,1770.3,949.4z"/>
						<g>
							<polyline class="st6" points="1750.6,949.4 1478.7,1127.2 1070.6,1123.7 			" />
							<path class="st7" d="M1006.8,1123.2c30-11.3,67.4-30.8,90.6-51.6l-18.5,52.2l17.8,52.5C1073.8,1155.1,1036.7,1135,1006.8,1123.2z
				"/>
						</g>
					</g>
					<g id="_4">
						<path id="circle11956-5" class="st5" d="M1675.9,778.1c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0
			C1668.3,760.4,1675.9,768.3,1675.9,778.1z"/>
						<g>
							<polyline class="st6" points="1658.8,779 2107.8,785.8 2239.8,605.3 2741,605.3 			" />
							<path class="st7" d="M2804.8,605.3c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C2737.6,573.9,2774.8,593.7,2804.8,605.3z"
							/>
						</g>
					</g>
					<g id="_6">
						<path id="circle11956-6" class="st5" d="M1831.3,1165.2c0,10-7.7,18-17.3,18c-9.6,0-17.3-8.1-17.3-18c0-10,7.7-18,17.3-18
			C1823.5,1147.2,1831.3,1155.3,1831.3,1165.2L1831.3,1165.2z"/>
						<g>
							<polyline class="st6" points="1814.3,1164.9 2263.2,1171.7 2395.3,991.1 2896.6,991.1 			" />
							<path class="st7" d="M2960.2,991.1c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C2893.1,959.8,2930.3,979.6,2960.2,991.1z"
							/>
						</g>
					</g>
					<g id="_7">
						<path id="circle11956-7" class="st5" d="M1829.3,1401.4c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1821.7,1384.4,1829.3,1392,1829.3,1401.4z"/>
						<g>
							<polyline class="st6" points="1813.4,1401.8 1553.8,1399.3 1404,1287.3 1066.9,1290.7 			" />
							<path class="st7" d="M1003.2,1291.3c29.9-11.9,66.9-32,89.8-53.2l-17.7,52.5l18.6,52.1C1070.6,1322,1033.3,1302.6,1003.2,1291.3z
				"/>
						</g>
					</g>
					<g id="_8">
						<path id="circle11956-8" class="st5" d="M1829.3,1612.9c0,10-8.7,18-18.9,16.9c-7.8-0.9-14.1-7.2-15-15
			c-1.1-10.3,6.9-18.9,16.9-18.9C1821.7,1595.9,1829.3,1603.5,1829.3,1612.9L1829.3,1612.9z"/>
						<g>
							<path class="st6" d="M1812.6,1612.6l150.4-94.8l268,1.8l212.4,92.6h286.7" />
							<path class="st7" d="M2793.7,1612.3c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3
				C2726.5,1580.9,2763.7,1600.7,2793.7,1612.3z"/>
						</g>
					</g>
					<g id="_9">
						<path id="circle11956-9" class="st5" d="M1829.3,1885.6c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1821.7,1868.6,1829.3,1876.2,1829.3,1885.6z"/>
						<g>
							<polyline class="st6" points="1811.4,1885.3 2071.1,1887.8 2220.9,1999.8 2558,1996.5 			" />
							<path class="st7" d="M2621.7,1995.8c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1
				C2554.2,1965.2,2591.6,1984.6,2621.7,1995.8z"/>
						</g>
					</g>
					<g id="_10">
						<path id="circle11956-10" class="st5" d="M1824.9,2156.4c13.3,18.2-6.4,38.8-23.9,24.9C1787.7,2163.1,1807.5,2142.5,1824.9,2156.4
			z"/>
						<g>
							<polyline class="st6" points="1813.6,2171 1466.6,2169.3 1286.6,1880.9 751.8,1880.9 			" />
							<path class="st7" d="M688.1,1880.9c30-11.6,67.2-31.4,90.2-52.3l-18.1,52.3l18.1,52.3C755.3,1912.2,718,1892.4,688.1,1880.9z" />
						</g>
					</g>
				</g>
			</svg>

		</StyledPage>);
}