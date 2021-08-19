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
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width = "100%" height = "100%"
				viewBox="0 0 2365.9 4324.3" preserveAspectRatio="none">
				<path id="FR" class="st0" d="M1162.5,2162.1L2179,2429v1808" />
				<path id="NL" class="st1" d="M1171.5,2162.1L846,2373v1864" />
				<path id="NR" class="st2" d="M1171.5,2162.1L1488,2373v1864" />
				<path id="FL" class="st3" d="M1183,2159.1L155,2429v1808" />
				<path id="RedLine_4_" class="st4" d="M1117.7,0v101.8l-43.2,43.2v4.1v659.9l97,224.6v1150.1" />
				<g id="FR_1_">
					<g id="_x37__3_">
						<path id="circle11956-6_12_" class="st5" d="M2162.7,2531.8c0-9.4,7.6-17,17-17c9.4,0,17,7.6,17,17c0,9.4-7.6,17-17,17
			C2170.3,2548.8,2162.7,2541.2,2162.7,2531.8L2162.7,2531.8z"/>
						<g>
							<polyline class="st6" points="2179.4,2532.1 2045,2531.9 1993.2,2715.7 1684.6,2715.7 			" />
							<path class="st7" d="M1615.2,2715.8c31.2-11.6,70-31.4,94-52.3l-18.9,52.3l18.9,52.3C1685.2,2747.1,1646.4,2727.3,1615.2,2715.8z
				"/>
						</g>
					</g>
					<g id="_x36__3_">
						<path id="circle11956-9_16_" class="st5" d="M2162.7,2793.7c0-9.4,7.6-17,17-17c9.4,0,17,7.6,17,17c0,9.4-7.6,17-17,17l0,0
			C2170.3,2810.7,2162.7,2803.1,2162.7,2793.7z"/>
						<g>
							<polyline class="st6" points="2180.6,2794 2004.6,2791.5 1932,2679.5 1580.9,2682.9 			" />
							<path class="st7" d="M1514.5,2683.5c31.1-11.9,69.7-32,93.5-53.2l-18.4,52.5l19.4,52.1
				C1584.8,2714.2,1545.8,2694.8,1514.5,2683.5z"/>
						</g>
					</g>
					<g id="_x35__4_">
						<path id="circle11956-6_11_" class="st5" d="M2162.7,3016c0-9.4,7.6-17,17-17c9.4,0,17,7.6,17,17c0,9.4-7.6,17-17,17
			C2170.3,3033,2162.7,3025.3,2162.7,3016L2162.7,3016z"/>
						<g>
							<polyline class="st6" points="2179.4,3016.3 2045,3016.1 1993.2,3199.9 1684.6,3199.9 			" />
							<path class="st7" d="M1615.2,3199.9c31.2-11.6,70-31.4,94-52.3l-18.9,52.3l18.9,52.3C1685.2,3231.3,1646.4,3211.5,1615.2,3199.9z
				"/>
						</g>
					</g>
					<g id="_x34__4_">
						<path id="circle11956-9_15_" class="st5" d="M2162.7,3269.2c0-9.4,7.6-17,17-17c9.4,0,17,7.6,17,17c0,9.4-7.6,17-17,17l0,0
			C2170.3,3286.2,2162.7,3278.6,2162.7,3269.2z"/>
						<g>
							<polyline class="st6" points="2180.6,3269.5 2004.6,3267 1932,3155 1580.9,3158.3 			" />
							<path class="st7" d="M1514.5,3159c31.1-11.9,69.7-32,93.5-53.2l-18.4,52.5l19.4,52.1C1584.8,3189.7,1545.8,3170.3,1514.5,3159z"
							/>
						</g>
					</g>
					<g id="_x33__3_">
						<path id="circle11956-9_14_" class="st5" d="M2162.7,3519.5c0-9.4,7.6-17,17-17c9.4,0,17,7.6,17,17c0,9.4-7.6,17-17,17l0,0
			C2170.3,3536.5,2162.7,3528.9,2162.7,3519.5z"/>
						<g>
							<polyline class="st6" points="2180.6,3519.8 2004.6,3517.3 1932,3405.3 1580.9,3408.6 			" />
							<path class="st7" d="M1514.5,3409.3c31.1-11.9,69.7-32,93.5-53.2l-18.4,52.5l19.4,52.1C1584.8,3440,1545.8,3420.6,1514.5,3409.3z
				"/>
						</g>
					</g>
					<g id="_x32__4_">
						<path id="circle11956-6_10_" class="st5" d="M2162.7,3771.3c0-9.4,7.6-17,17-17c9.4,0,17,7.6,17,17c0,9.4-7.6,17-17,17
			C2170.3,3788.3,2162.7,3780.7,2162.7,3771.3L2162.7,3771.3z"/>
						<g>
							<polyline class="st6" points="2179.4,3771.6 2045,3771.4 1993.2,3955.3 1684.6,3955.3 			" />
							<path class="st7" d="M1615.2,3955.3c31.2-11.6,70-31.4,94-52.3l-18.9,52.3l18.9,52.3C1685.2,3986.6,1646.4,3966.9,1615.2,3955.3z
				"/>
						</g>
					</g>
					<g id="_x31__4_">
						<path id="circle11956-9_13_" class="st5" d="M2162.7,4115.6c0-9.4,7.6-17,17-17c9.4,0,17,7.6,17,17s-7.6,17-17,17l0,0
			C2170.3,4132.6,2162.7,4125,2162.7,4115.6z"/>
						<g>
							<polyline class="st6" points="2180.6,4115.9 2004.6,4113.4 1932,4001.4 1580.9,4004.8 			" />
							<path class="st7" d="M1514.5,4005.4c31.1-11.9,69.7-32,93.5-53.2l-18.4,52.5l19.4,52.1
				C1584.8,4036.1,1545.8,4016.7,1514.5,4005.4z"/>
						</g>
					</g>
				</g>
				<g id="NL_1_">
					<g id="_x37__2_">
						<path id="circle11956-6_9_" class="st5" d="M866,2561.1c0-9.4-7.6-17-17-17s-17,7.6-17,17c0,9.4,7.6,17,17,17
			S866,2570.5,866,2561.1L866,2561.1z"/>
						<g>
							<polyline class="st6" points="849.4,2561.4 983.8,2561.2 1035.6,2745 1344.1,2745 			" />
							<path class="st7" d="M1413.5,2745c-31.2-11.6-70-31.4-94-52.3l18.9,52.3l-18.9,52.3C1343.6,2776.4,1382.3,2756.6,1413.5,2745z" />
						</g>
					</g>
					<g id="_x36__2_">
						<path id="circle11956-9_12_" class="st5" d="M866,2823c0-9.4-7.6-17-17-17s-17,7.6-17,17c0,9.4,7.6,17,17,17l0,0
			C858.4,2840,866,2832.4,866,2823z"/>
						<g>
							<polyline class="st6" points="848.1,2823.3 1024.2,2820.8 1096.8,2708.8 1447.9,2712.2 			" />
							<path class="st7" d="M1514.3,2712.8c-31.1-11.9-69.7-32-93.5-53.2l18.4,52.5l-19.4,52.1C1444,2743.5,1482.9,2724.1,1514.3,2712.8
				z"/>
						</g>
					</g>
					<g id="_x35__3_">
						<path id="circle11956-6_8_" class="st5" d="M866,3045.2c0-9.4-7.6-17-17-17s-17,7.6-17,17c0,9.4,7.6,17,17,17
			S866,3054.6,866,3045.2L866,3045.2z"/>
						<g>
							<polyline class="st6" points="849.4,3045.5 983.8,3045.4 1035.6,3229.2 1344.1,3229.2 			" />
							<path class="st7" d="M1413.5,3229.2c-31.2-11.6-70-31.4-94-52.3l18.9,52.3l-18.9,52.3C1343.6,3260.6,1382.3,3240.8,1413.5,3229.2
				z"/>
						</g>
					</g>
					<g id="_x34__3_">
						<path id="circle11956-9_11_" class="st5" d="M866,3298.5c0-9.4-7.6-17-17-17s-17,7.6-17,17c0,9.4,7.6,17,17,17l0,0
			C858.4,3315.5,866,3307.9,866,3298.5z"/>
						<g>
							<polyline class="st6" points="848.1,3298.8 1024.2,3296.3 1096.8,3184.3 1447.9,3187.6 			" />
							<path class="st7" d="M1514.3,3188.3c-31.1-11.9-69.7-32-93.5-53.2l18.4,52.5l-19.4,52.1C1444,3219,1482.9,3199.6,1514.3,3188.3z"
							/>
						</g>
					</g>
					<g id="_x33__2_">
						<path id="circle11956-9_10_" class="st5" d="M866,3548.8c0-9.4-7.6-17-17-17s-17,7.6-17,17c0,9.4,7.6,17,17,17l0,0
			C858.4,3565.8,866,3558.2,866,3548.8z"/>
						<g>
							<polyline class="st6" points="848.1,3549.1 1024.2,3546.6 1096.8,3434.6 1447.9,3437.9 			" />
							<path class="st7" d="M1514.3,3438.6c-31.1-11.9-69.7-32-93.5-53.2l18.4,52.5l-19.4,52.1C1444,3469.3,1482.9,3449.9,1514.3,3438.6
				z"/>
						</g>
					</g>
					<g id="_x32__3_">
						<path id="circle11956-6_7_" class="st5" d="M866,3800.6c0-9.4-7.6-17-17-17s-17,7.6-17,17c0,9.4,7.6,17,17,17S866,3810,866,3800.6
			L866,3800.6z"/>
						<g>
							<polyline class="st6" points="849.4,3800.9 983.8,3800.7 1035.6,3984.6 1344.1,3984.6 			" />
							<path class="st7" d="M1413.5,3984.6c-31.2-11.6-70-31.4-94-52.3l18.9,52.3l-18.9,52.3C1343.6,4015.9,1382.3,3996.2,1413.5,3984.6
				z"/>
						</g>
					</g>
					<g id="_x31__2_">
						<path id="circle11956-9_9_" class="st5" d="M866,4144.9c0-9.4-7.6-17-17-17s-17,7.6-17,17c0,9.4,7.6,17,17,17l0,0
			C858.4,4161.9,866,4154.3,866,4144.9z"/>
						<g>
							<polyline class="st6" points="848.1,4145.2 1024.2,4142.7 1096.8,4030.7 1447.9,4034.1 			" />
							<path class="st7" d="M1514.3,4034.7c-31.1-11.9-69.7-32-93.5-53.2l18.4,52.5l-19.4,52.1C1444,4065.4,1482.9,4046,1514.3,4034.7z"
							/>
						</g>
					</g>
				</g>
				<g id="NR_1_">
					<g id="_x37__1_">
						<path id="circle11956-6_6_" class="st5" d="M1469.7,4150.2c0,9.4,7.6,17,17,17s17-7.6,17-17s-7.6-17-17-17
			S1469.7,4140.8,1469.7,4150.2L1469.7,4150.2z"/>
						<g>
							<polyline class="st6" points="1486.3,4149.9 1351.9,4150.1 1300.1,3966.2 991.5,3966.2 			" />
							<path class="st7" d="M922.1,3966.2c31.2,11.6,70,31.4,94,52.3l-18.9-52.3l18.9-52.3C992.1,3934.9,953.4,3954.6,922.1,3966.2z" />
						</g>
					</g>
					<g id="_x36__1_">
						<path id="circle11956-9_8_" class="st5" d="M1469.7,3888.2c0,9.4,7.6,17,17,17s17-7.6,17-17c0-9.4-7.6-17-17-17l0,0
			C1477.3,3871.2,1469.7,3878.8,1469.7,3888.2z"/>
						<g>
							<polyline class="st6" points="1487.6,3887.9 1311.5,3890.5 1238.9,4002.5 887.8,3999.1 			" />
							<path class="st7" d="M821.4,3998.5c31.1,11.9,69.7,32,93.5,53.2l-18.4-52.5l19.4-52.1C891.7,3967.8,852.8,3987.2,821.4,3998.5z"
							/>
						</g>
					</g>
					<g id="_x35__2_">
						<path id="circle11956-6_5_" class="st5" d="M1469.7,3666c0,9.4,7.6,17,17,17s17-7.6,17-17c0-9.4-7.6-17-17-17
			S1469.7,3656.6,1469.7,3666L1469.7,3666z"/>
						<g>
							<polyline class="st6" points="1486.3,3665.7 1351.9,3665.9 1300.1,3482.1 991.5,3482.1 			" />
							<path class="st7" d="M922.1,3482.1c31.2,11.6,70,31.4,94,52.3l-18.9-52.3l18.9-52.3C992.1,3450.7,953.4,3470.5,922.1,3482.1z" />
						</g>
					</g>
					<g id="_x34__2_">
						<path id="circle11956-9_7_" class="st5" d="M1469.7,3412.8c0,9.4,7.6,17,17,17s17-7.6,17-17c0-9.4-7.6-17-17-17l0,0
			C1477.3,3395.8,1469.7,3403.4,1469.7,3412.8z"/>
						<g>
							<polyline class="st6" points="1487.6,3412.5 1311.5,3415 1238.9,3527 887.8,3523.6 			" />
							<path class="st7" d="M821.4,3523c31.1,11.9,69.7,32,93.5,53.2l-18.4-52.5l19.4-52.1C891.7,3492.3,852.8,3511.7,821.4,3523z" />
						</g>
					</g>
					<g id="_x33__1_">
						<path id="circle11956-9_6_" class="st5" d="M1469.7,3162.5c0,9.4,7.6,17,17,17s17-7.6,17-17c0-9.4-7.6-17-17-17l0,0
			C1477.3,3145.5,1469.7,3153.1,1469.7,3162.5z"/>
						<g>
							<polyline class="st6" points="1487.6,3162.2 1311.5,3164.7 1238.9,3276.7 887.8,3273.3 			" />
							<path class="st7" d="M821.4,3272.7c31.1,11.9,69.7,32,93.5,53.2l-18.4-52.5l19.4-52.1C891.7,3242,852.8,3261.4,821.4,3272.7z" />
						</g>
					</g>
					<g id="_x32__2_">
						<path id="circle11956-6_4_" class="st5" d="M1469.7,2910.7c0,9.4,7.6,17,17,17s17-7.6,17-17c0-9.4-7.6-17-17-17
			S1469.7,2901.3,1469.7,2910.7L1469.7,2910.7z"/>
						<g>
							<polyline class="st6" points="1486.3,2910.4 1351.9,2910.5 1300.1,2726.7 991.5,2726.7 			" />
							<path class="st7" d="M922.1,2726.7c31.2,11.6,70,31.4,94,52.3l-18.9-52.3l18.9-52.3C992.1,2695.3,953.4,2715.1,922.1,2726.7z" />
						</g>
					</g>
					<g id="_x31__1_">
						<path id="circle11956-9_5_" class="st5" d="M1469.7,2566.3c0,9.4,7.6,17,17,17s17-7.6,17-17c0-9.4-7.6-17-17-17l0,0
			C1477.3,2549.3,1469.7,2557,1469.7,2566.3z"/>
						<g>
							<polyline class="st6" points="1487.6,2566 1311.5,2568.6 1238.9,2680.6 887.8,2677.2 			" />
							<path class="st7" d="M821.4,2676.6c31.1,11.9,69.7,32,93.5,53.2l-18.4-52.5l19.4-52.1C891.7,2645.9,852.8,2665.3,821.4,2676.6z"
							/>
						</g>
					</g>
				</g>
				<g id="FL_1_">
					<g id="_x37_">
						<path id="circle11956-6_3_" class="st5" d="M170.6,4145.9c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17
			S170.6,4136.5,170.6,4145.9L170.6,4145.9z"/>
						<g>
							<polyline class="st6" points="154,4145.6 288.4,4145.8 340.2,3962 648.8,3962 			" />
							<path class="st7" d="M718.1,3962c-31.2,11.6-70,31.4-94,52.3l18.9-52.3l-18.9-52.3C648.2,3930.6,686.9,3950.4,718.1,3962z" />
						</g>
					</g>
					<g id="_x36_">
						<path id="circle11956-9_3_" class="st5" d="M170.6,3884c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0
			C163,3867,170.6,3874.6,170.6,3884z"/>
						<g>
							<polyline class="st6" points="152.7,3883.7 328.8,3886.2 401.4,3998.2 752.5,3994.8 			" />
							<path class="st7" d="M818.9,3994.2c-31.1,11.9-69.7,32-93.5,53.2l18.4-52.5l-19.4-52.1C748.6,3963.5,787.5,3982.9,818.9,3994.2z"
							/>
						</g>
					</g>
					<g id="_x35__1_">
						<path id="circle11956-6_2_" class="st5" d="M170.6,3661.8c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17
			S170.6,3652.4,170.6,3661.8L170.6,3661.8z"/>
						<g>
							<polyline class="st6" points="154,3661.5 288.4,3661.6 340.2,3477.8 648.8,3477.8 			" />
							<path class="st7" d="M718.1,3477.8c-31.2,11.6-70,31.4-94,52.3l18.9-52.3l-18.9-52.3C648.2,3446.4,686.9,3466.2,718.1,3477.8z" />
						</g>
					</g>
					<g id="_x34__1_">
						<path id="circle11956-9_2_" class="st5" d="M170.6,3408.5c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0
			C163,3391.5,170.6,3399.1,170.6,3408.5z"/>
						<g>
							<polyline class="st6" points="152.7,3408.2 328.8,3410.7 401.4,3522.7 752.5,3519.4 			" />
							<path class="st7" d="M818.9,3518.7c-31.1,11.9-69.7,32-93.5,53.2l18.4-52.5l-19.4-52.1C748.6,3488,787.5,3507.4,818.9,3518.7z" />
						</g>
					</g>
					<g id="_x33_">
						<path id="circle11956-9_1_" class="st5" d="M170.6,3158.2c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0
			C163,3141.2,170.6,3148.8,170.6,3158.2z"/>
						<g>
							<polyline class="st6" points="152.7,3157.9 328.8,3160.4 401.4,3272.4 752.5,3269.1 			" />
							<path class="st7" d="M818.9,3268.4c-31.1,11.9-69.7,32-93.5,53.2l18.4-52.5l-19.4-52.1C748.6,3237.7,787.5,3257.1,818.9,3268.4z"
							/>
						</g>
					</g>
					<g id="_x32__1_">
						<path id="circle11956-6_1_" class="st5" d="M170.6,2906.4c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17
			S170.6,2897,170.6,2906.4L170.6,2906.4z"/>
						<g>
							<polyline class="st6" points="154,2906.1 288.4,2906.3 340.2,2722.4 648.8,2722.4 			" />
							<path class="st7" d="M718.1,2722.4c-31.2,11.6-70,31.4-94,52.3l18.9-52.3l-18.9-52.3C648.2,2691.1,686.9,2710.8,718.1,2722.4z" />
						</g>
					</g>
					<g id="_x31__3_">
						<path id="circle11956-9_4_" class="st5" d="M170.6,2562.1c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0
			C163,2545.1,170.6,2552.7,170.6,2562.1z"/>
						<g>
							<polyline class="st6" points="152.7,2561.8 328.8,2564.3 401.4,2676.3 752.5,2672.9 			" />
							<path class="st7" d="M818.9,2672.3c-31.1,11.9-69.7,32-93.5,53.2l18.4-52.5l-19.4-52.1C748.6,2641.6,787.5,2661,818.9,2672.3z" />
						</g>
					</g>
				</g>
				<g id="Main">
					<g id="_1">
						<path id="circle11956" class="st5" d="M1091,181.1c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1083.4,164.1,1091,171.8,1091,181.1z"/>
						<g>
							<polyline class="st6" points="1075,181.1 804.5,183.6 648.5,295.6 297.4,292.3 			" />
							<path class="st7" d="M231,291.6c31.3-11.3,70.3-30.7,94.5-51.4l-19.4,52.1l18.4,52.5C300.7,323.7,262.1,303.5,231,291.6z" />
						</g>
					</g>
					<g id="_2">
						<path id="circle11956-2" class="st5" d="M1088.5,356.6c13.9,18.2-6.7,38.8-24.9,24.9C1049.7,363.3,1070.2,342.7,1088.5,356.6z" />
						<g>
							<polyline class="st6" points="1074.3,369.4 1357.5,191.6 1782.6,195.1 			" />
							<path class="st7" d="M1849,195.6c-31.3,11.3-70.2,30.8-94.4,51.6l19.3-52.2l-18.5-52.5C1779.3,163.7,1817.9,183.8,1849,195.6z" />
						</g>
					</g>
					<g id="_3">
						<path id="circle11956-3" class="st5" d="M1092,557.7c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17S1092,548.3,1092,557.7
			L1092,557.7z"/>
						<g>
							<path class="st6" d="M1074,557.5l-156.7-94.8l-303.2,7.4l-166.7,80.1c-9.5,4.6-20,7-30.5,7H118.4" />
							<path class="st7" d="M52,557.2c31.2-11.6,70-31.4,94-52.3l-18.9,52.3l18.9,52.3C122,588.5,83.2,568.8,52,557.2z" />
						</g>
					</g>
					<g id="_5">
						<path id="circle11956-4" class="st5" d="M1142.5,917.9c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1134.9,900.9,1142.5,908.6,1142.5,917.9z"/>
						<g>
							<polyline class="st6" points="1122.7,917.9 839.5,1095.7 414.4,1092.2 			" />
							<path class="st7" d="M348,1091.7c31.3-11.3,70.2-30.8,94.4-51.6l-19.3,52.2l18.5,52.5C417.7,1123.6,379.1,1103.5,348,1091.7z" />
						</g>
					</g>
					<g id="_4">
						<path id="circle11956-5" class="st5" d="M1091.4,730.5c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1083.8,713.5,1091.4,721.1,1091.4,730.5z"/>
						<g>
							<polyline class="st6" points="1074.3,731.4 1542,738.2 1679.5,557.7 2201.6,557.7 			" />
							<path class="st7" d="M2268,557.7c-31.2,11.6-70,31.4-94,52.3l18.9-52.3l-18.9-52.3C2198,526.3,2236.8,546.1,2268,557.7z" />
						</g>
					</g>
					<g id="_6">
						<path id="circle11956-6" class="st5" d="M1188.9,1097.3c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17
			S1188.9,1087.9,1188.9,1097.3L1188.9,1097.3z"/>
						<g>
							<polyline class="st6" points="1172.3,1097 1639.9,1103.8 1777.4,923.2 2299.6,923.2 			" />
							<path class="st7" d="M2365.9,923.2c-31.2,11.6-70,31.4-94,52.3l18.9-52.3l-18.9-52.3C2296,891.9,2334.7,911.7,2365.9,923.2z" />
						</g>
					</g>
					<g id="_7">
						<path id="circle11956-7" class="st5" d="M1188.4,1314.3c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1180.8,1297.3,1188.4,1304.9,1188.4,1314.3z"/>
						<g>
							<polyline class="st6" points="1172.5,1314.7 902.1,1312.2 746.1,1200.2 394.9,1203.6 			" />
							<path class="st7" d="M328.6,1204.2c31.1-11.9,69.7-32,93.5-53.2l-18.4,52.5l19.4,52.1C398.8,1234.9,359.9,1215.5,328.6,1204.2z"
							/>
						</g>
					</g>
					<g id="_8">
						<path id="circle11956-8" class="st5" d="M1188.9,1530.6c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17
			S1188.9,1521.2,1188.9,1530.6L1188.9,1530.6z"/>
						<g>
							<path class="st6" d="M1172.2,1530.3l156.7-94.8l279.2,1.8l221.2,92.6h298.6" />
							<path class="st7" d="M2194.2,1530c-31.2,11.6-70,31.4-94,52.3l18.9-52.3l-18.9-52.3C2124.2,1498.6,2162.9,1518.4,2194.2,1530z" />
						</g>
					</g>
					<g id="_9">
						<path id="circle11956-9" class="st5" d="M1188.9,1779.6c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0
			C1181.3,1762.6,1188.9,1770.2,1188.9,1779.6z"/>
						<g>
							<polyline class="st6" points="1171,1779.3 1441.5,1781.8 1597.5,1893.8 1948.6,1890.5 			" />
							<path class="st7" d="M2015,1889.8c-31.1,11.9-69.7,32-93.5,53.2l18.4-52.5l-19.4-52.1C1944.7,1859.2,1983.6,1878.6,2015,1889.8z"
							/>
						</g>
					</g>
					<g id="_10">
						<path id="circle11956-10" class="st5" d="M1184.2,1978.2c13.9,18.2-6.7,38.8-24.9,24.9C1145.4,1984.9,1166,1964.3,1184.2,1978.2z"
						/>
						<g>
							<polyline class="st6" points="1172.4,1992.8 810.9,1991.1 623.5,1702.7 66.4,1702.7 			" />
							<path class="st7" d="M0,1702.7c31.2-11.6,70-31.4,94-52.3l-18.9,52.3L94,1755C70,1734,31.2,1714.2,0,1702.7z" />
						</g>
					</g>
				</g>
			</svg>
		</StyledPage>);
}