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
	display: inline;
	max-width: 25%;
	overflow-wrap: break-word; // breaks the word if it overflows 
`
const ContentBox = (props) => (
	<ContentBoxContainer ref={props.boxRef} x={props.x} y={props.y}>
		<Paper style={{ padding: 20 }}>
			<Grid justify="center">
				<Grid item xs={12} >
					<BlackTypography variant={"h4"}>
						{props.title}
					</BlackTypography>
					<Divider />
				</Grid>
				<Grid style={{ marginTop: 10 }} item xs={10}>
					<BlackTypography>
						{props.body}
					</BlackTypography>
				</Grid>
			</Grid>
		</Paper>
	</ContentBoxContainer>

)
const ContentBoxes = [
	{
		key: 0,
		title: "Family Background",
		body: "My mother is Jewish, and my father is Italian, German, and French in that order.",
		x: 4,
		y: 4,
		cd: "M1677.9,228.7c0,9.4-7.3,17-16.3,17c-9,0-16.3-7.6-16.3-17s7.3-17,16.3-17l0,0C1670.6,211.7,1677.9,219.4,1677.9,228.7z",
		ld: "M1659.5,228.7 1399.8,231.2 1250,343.2 913,339.9 			",
		ad: "M849.2,339.2c30-11.3,67.5-30.7,90.7-51.4l-18.6,52.1l17.7,52.5C916.1,371.3,879.1,351.1,849.2,339.2z"
	},
	{
		key: 1,
		title: "Upper West Side, IPS, and Spanish Lessons",
		x: 68,
		y: 3,
		ld: "M1658.8,417 1930.7,239.2 2338.8,242.7 			",
		ad: "M2402.5,243.2c-30,11.3-67.4,30.8-90.6,51.6l18.5-52.2l-17.8-52.5C2335.6,211.3,2372.7,231.4,2402.5,243.2z",
		cd: "M1672.9,404.2c13.9,18.2-6.7,38.8-24.9,24.9C1634.2,410.9,1654.6,390.3,1672.9,404.2z"
	},
	{
		key: 2,
		title: "PreK",
		x: 1,
		y: 7,
		ld: "M1658.8,605.3 1259.5,605.3 1155.4,487.3 818.2,487.3 ",
		ad: "M751.8,487.3c31.2-11.6,70-31.4,94-52.3l-18.9,52.3l18.9,52.3C821.8,518.7,783.1,498.9,751.8,487.3z",
		cd: "M1676.5,605.3c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17S1676.5,595.9,1676.5,605.3L1676.5,605.3	"
	},
	{
		key: 3,
		cd: "M1675.9,778.1c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0C1668.3,760.4,1675.9,768.3,1675.9,778.1z",
		ld: "M1658.8,779 2107.8,785.8 2239.8,605.3 2741,605.3 			",
		ad: "M2804.8,605.3c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C2737.6,573.9,2774.8,593.7,2804.8,605.3z"
	},
	{
		key: 4,
		cd: "M1770.3,949.4c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0C1762.7,932.4,1770.3,940.1,1770.3,949.4z",
		ld: "M1750.6,949.4 1478.7,1127.2 1070.6,1123.7 			",
		ad: "M1006.8,1123.2c30-11.3,67.4-30.8,90.6-51.6l-18.5,52.2l17.8,52.5C1073.8,1155.1,1036.7,1135,1006.8,1123.2z"
	},
	{
		key: 5,
		cd: "M1831.3,1165.2c0,10-7.7,18-17.3,18c-9.6,0-17.3-8.1-17.3-18c0-10,7.7-18,17.3-18C1823.5,1147.2,1831.3,1155.3,1831.3,1165.2L1831.3,1165.2z",
		ld: "M1814.3,1164.9 2263.2,1171.7 2395.3,991.1 2896.6,991.1 			",
		ad: "M2960.2,991.1c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C2893.1,959.8,2930.3,979.6,2960.2,991.1z"
	},
	{
		key: 6,
		cd: "M1829.3,1401.4c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0C1821.7,1384.4,1829.3,1392,1829.3,1401.4z",
		ld: "M1813.4,1401.8 1553.8,1399.3 1404,1287.3 1066.9,1290.7 			",
		ad: "M1003.2,1291.3c29.9-11.9,66.9-32,89.8-53.2l-17.7,52.5l18.6,52.1C1070.6,1322,1033.3,1302.6,1003.2,1291.3z"
	},
	{
		key: 7,
		cd: "M1829.3,1612.9c0,10-8.7,18-18.9,16.9c-7.8-0.9-14.1-7.2-15-15c-1.1-10.3,6.9-18.9,16.9-18.9C1821.7,1595.9,1829.3,1603.5,1829.3,1612.9L1829.3,1612.9z",
		ld: "M1813.4,1612.9 1964.5,1697.3 2589.1,1697.3",
		ad: "M2655.5,1697.3c-31.2,11.6-70,31.4-94,52.3l18.9-52.3l-18.9-52.3C2585.5,1666,2624.3,1685.7,2655.5,1697.3z"
	},
	{
		key: 8,
		cd: "M1829.3,1885.6c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17l0,0C1821.7,1868.6,1829.3,1876.2,1829.3,1885.6z",
		ld: "M1811.4,1885.3 2071.1,1887.8 2220.9,1999.8 2558,1996.5 			",
		ad: "M2621.7,1995.8c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C2554.2,1965.2,2591.6,1984.6,2621.7,1995.8z"
	},
	{
		key: 9,
		cd: "M1824.9,2156.4c13.3,18.2-6.4,38.8-23.9,24.9C1787.7,2163.1,1807.5,2142.5,1824.9,2156.4z",
		ld: "M1813.6,2171 1466.6,2169.3 1286.6,1880.9 751.8,1880.9 			",
		ad: "M688.1,1880.9c30-11.6,67.2-31.4,90.2-52.3l-18.1,52.3l18.1,52.3C755.3,1912.2,718,1892.4,688.1,1880.9z"
	},
	{
		key: 10,
		cd: "M1830.6,2415.8c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0C1823,2398.8,1830.6,2406.4,1830.6,2415.8z",
		ld: "M1812.8,2415.5 2072.5,2418 2222.2,2530 2559.3,2526.7 			",
		ad: "M2623,2526c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C2555.5,2495.4,2592.9,2514.8,2623,2526z"
	},
	{
		key: 11,
		cd: "M1829.3,2625c0,9.4-7.6,17-17,17s-17-7.6-17-17c0-9.4,7.6-17,17-17S1829.3,2615.6,1829.3,2625L1829.3,2625z",
		ld: "M1811.4,2624.8 1551.7,2625 1365.2,2485.7 914.1,2485.7",
		ad: "M847.7,2485.7c31.2-11.6,70-31.4,94-52.3l-18.9,52.3l18.9,52.3C917.7,2517,879,2497.3,847.7,2485.7z"
	}
]
const FLContentBoxes = [
	{
		key: 9,
		cd: "M265.4,6365.4c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0C257.8,6347.7,265.4,6355.6,265.4,6365.4z",
		ld: "M248.3,6366.3 480.2,6366.3 578.1,6192.6 987.1,6192.6 			",
		ad: "M1030.6,6192.6c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C963.4,6161.2,1000.7,6181,1030.6,6192.6z"
	},
	{
		key: 8,
		cd: "M232.5,5922c0-9.4,7.6-17,17-17s17,7.6,17,17c0,9.4-7.6,17-17,17l0,0C240.1,5939,232.5,5931.4,232.5,5922z",
		ld: "M267.1,5921.5 561,5922 606.1,6036.6 995,6032.7 			",
		ad: "M1058.6,6032.1c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C991.2,6001.4,1028.6,6020.8,1058.6,6032.1z"
	},
	{
		key: 7,
		cd: "M232.5,5610.5c0-9.4,7.6-17,17-17s17,7.6,17,17c0,9.4-7.6,17-17,17l0,0C240.1,5627.5,232.5,5619.9,232.5,5610.5z",
		ld: "M267.1,5610.1 561,5610.5 606.1,5725.2 995,5721.2 			",
		ad: "M1058.6,5720.6c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C991.2,5689.9,1028.6,5709.3,1058.6,5720.6z"
	},
	{
		key: 6,
		cd: "M265.4,5333.6c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0C257.8,5315.9,265.4,5323.8,265.4,5333.6z",
		ld: "M248.3,5334.5 480.2,5334.5 578.1,5160.8 987.1,5160.8 			",
		ad: "M1030.6,5160.8c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C963.4,5129.4,1000.7,5149.2,1030.6,5160.8z"
	},
	{
		key: 5,
		cd: "M232.5,4803.9c0-9.4,7.6-17,17-17s17,7.6,17,17c0,9.4-7.6,17-17,17l0,0C240.1,4820.9,232.5,4813.3,232.5,4803.9z",
		ld: "M267.1,4803.4 561,4803.9 606.1,4918.5 995,4914.6 			",
		ad: "M1058.6,4914c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C991.2,4883.3,1028.6,4902.7,1058.6,4914z"
	},
	{
		key: 4,
		cd: "M265.4,4501.6c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0C257.8,4483.9,265.4,4491.8,265.4,4501.6z",
		ld: "M248.3,4502.5 480.2,4502.5 578.1,4328.8 987.1,4328.8 			",
		ad: "M1030.6,4328.8c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C963.4,4297.4,1000.7,4317.2,1030.6,4328.8z",
	},
	{
		key: 3,
		cd: "M232.5,4283.2c0-9.4,7.6-17,17-17s17,7.6,17,17s-7.6,17-17,17l0,0C240.1,4300.2,232.5,4292.6,232.5,4283.2z",
		ld: "M267.1,4282.8 561,4283.2 606.1,4397.9 995,4393.9 			",
		ad: "M1058.6,4393.3c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C991.2,4362.6,1028.6,4382,1058.6,4393.3z"
	},
	{
		key: 2,
		cd: "M232.5,3971.8c0-9.4,7.6-17,17-17s17,7.6,17,17c0,9.4-7.6,17-17,17l0,0C240.1,3988.8,232.5,3981.2,232.5,3971.8z",
		ld: "M267.1,3971.4 561,3971.8 606.1,4086.4 995,4082.5 			",
		ad: "M1058.6,4081.9c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C991.2,4051.2,1028.6,4070.6,1058.6,4081.9z"
	},
	{
		key: 1,
		cd: "M265.4,3739c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0C257.8,3721.3,265.4,3729.2,265.4,3739z",
		ld: "M248.3,3739.9 480.2,3739.9 578.1,3566.2 987.1,3566.2 			",
		ad: "M1030.6,3566.2c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C963.4,3534.8,1000.7,3554.6,1030.6,3566.2z"
	},
	{
		key: 0,
		cd: "M232.5,3402.9c0-9.4,7.6-17,17-17s17,7.6,17,17c0,9.4-7.6,17-17,17l0,0C240.1,3419.9,232.5,3412.3,232.5,3402.9z",
		ld: "M267.1,3402.5 561,3402.9 606.1,3518.5 995,3514.6 			",
		ad: "M1058.6,3513c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1C991.2,3482.3,1028.6,3501.7,1058.6,3513z",
	}
]

const NLContentBoxes = [
	{
		key: 9,
		cd: "M1330.7,6341.8c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0    C1323.1,6324.1,1330.7,6332,1330.7,6341.8z",
		ld: "M1313.6,6342.7 1545.5,6342.7 1643.4,6169 2310,6172.9",
		ad: "M2353.5,6172.9c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3     C2286.3,6141.5,2323.6,6161.3,2353.5,6172.9z",
	},
	{
		key: 8,
		cd: "M1297.8,5898.4c0-9.4,7.6-17,17-17s17,7.6,17,17s-7.6,17-17,17l0,0    C1305.4,5915.4,1297.8,5907.8,1297.8,5898.4z",
		ld: "M1332.4,5898 1626.3,5898.4 1671.4,6013 2317.8,6013",
		ad: "M2381.5,6012.4c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1     C2314.1,5981.7,2351.4,6001.1,2381.5,6012.4z"
	},
	{
		key: 7,
		cd: "M1297.8,5587c0-9.4,7.6-17,17-17s17,7.6,17,17s-7.6,17-17,17l0,0    C1305.4,5604,1297.8,5596.4,1297.8,5587z",
		ld: "M1332.4,5586.5 1626.3,5587 1671.4,5701.6 2317.8,5701.5",
		ad: "M2381.5,5700.9c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1     C2314.1,5670.2,2351.4,5689.6,2381.5,5700.9z"
	},
	{
		key: 6,
		cd: "M1330.7,5310c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0    C1323.1,5292.3,1330.7,5300.3,1330.7,5310z",
		ld: "M1313.6,5310.9 1968.1,5310 2073.5,5150.8 2482.5,5150.8",
		ad: "M2526.1,5150.8c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3     C2458.9,5119.4,2496.1,5139.2,2526.1,5150.8z"
	},
	{
		key: 5,
		cd: "M1297.8,4780.3c0-9.4,7.6-17,17-17s17,7.6,17,17s-7.6,17-17,17l0,0    C1305.4,4797.3,1297.8,4789.7,1297.8,4780.3z",
		ld: "M1332.4,4779.9 1626.3,4780.3 1671.4,4894.9 2060.3,4891",
		ad: "M2123.9,4890.4c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1     C2056.5,4859.7,2093.9,4879.1,2123.9,4890.4z"
	},
	{
		key: 4,
		cd: "M1330.7,4478c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0    C1323.1,4460.3,1330.7,4468.2,1330.7,4478z",
		ld: "M1313.6,4478.9 1545.5,4478.9 1643.4,4305.2 2518.2,4305.9",
		ad: "M2561.7,4305.9c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3     C2494.5,4274.5,2531.8,4294.3,2561.7,4305.9z"
	},
	{
		key: 3,
		cd: "M1297.8,4259.7c0-9.4,7.6-17,17-17s17,7.6,17,17s-7.6,17-17,17l0,0    C1305.4,4276.7,1297.8,4269.1,1297.8,4259.7z",
		ld: "M1332.4,4259.2 1626.3,4259.7 1671.4,4374.3 2526.1,4371.1",
		ad: "M2589.7,4370.5c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1     C2522.3,4339.8,2559.7,4359.2,2589.7,4370.5z"
	},
	{
		key: 2,
		"cd": "M1297.8,3948.3c0-9.4,7.6-17,17-17s17,7.6,17,17c0,9.4-7.6,17-17,17l0,0    C1305.4,3965.3,1297.8,3957.7,1297.8,3948.3z",
		"ld": "M1332.4,3947.8 1626.3,3948.3 1671.4,4062.9 2526.1,4059.7",
		"ad": "M2589.7,4059.1c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1     C2522.3,4028.4,2559.7,4047.8,2589.7,4059.1z"
	},
	{
		key: 1,
		"cd": "M1330.7,3715.5c0,9.8-7.6,17.7-17,17.7s-17-7.9-17-17.7s7.6-17.7,17-17.7l0,0    C1323.1,3697.8,1330.7,3705.7,1330.7,3715.5z",
		"ld": "M1313.6,3716.4 1545.5,3716.4 1643.4,3542.7 2518.2,3543.4",
		"ad": "M2561.7,3543.4c-30,11.6-67.2,31.4-90.2,52.3l18.1-52.3l-18.1-52.3C2494.5,3512,2531.8,3531.8,2561.7,3543.4     z"
	},
	{
		key: 0,
		"cd": "M1297.8,3379.4c0-9.4,7.6-17,17-17s17,7.6,17,17c0,9.4-7.6,17-17,17l0,0    C1305.4,3396.4,1297.8,3388.8,1297.8,3379.4z",
		"ld": "M1332.4,3378.9 1626.3,3379.4 1671.4,3494 2526.1,3490.8",
		"ad": "M2589.7,3490.2c-29.9,11.9-66.9,32-89.8,53.2l17.7-52.5l-18.6-52.1     C2522.3,3459.5,2559.7,3478.9,2589.7,3490.2z"
	}
]

const NRContentBoxes = [
	{
		key: 9,
		"cd": "M2322.6,6384.3c0,9.4-7.6,17-17,17c-9.4,0-17-7.6-17-17s7.6-17,17-17l0,0    C2315,6367.3,2322.6,6374.9,2322.6,6384.3z",
		"ld": "M2288,6384.7 1994.1,6384.3 1949,6269.6 1094.3,6272.8",
		"ad": "M1030.6,6273.4c29.9-11.9,66.9-32,89.8-53.2l-17.7,52.5l18.6,52.1C1098,6304.1,1060.7,6284.7,1030.6,6273.4z"
	},
	{
		key: 8,
		"cd": "M2289.6,6048.2c0-9.8,7.6-17.7,17-17.7c9.4,0,17,7.9,17,17.7s-7.6,17.7-17,17.7l0,0    C2297.2,6065.9,2289.6,6057.9,2289.6,6048.2z",
		"ld": "M2306.7,6047.3 2074.9,6047.3 1977,6221 1102.1,6220.2",
		"ad": "M1058.6,6220.2c30-11.6,67.2-31.4,90.2-52.3l-18.1,52.3l18.1,52.3     C1125.8,6251.6,1088.6,6231.8,1058.6,6220.2z"
	},
	{
		key: 7,
		"cd": "M2322.6,5815.4c0,9.4-7.6,17-17,17c-9.4,0-17-7.6-17-17s7.6-17,17-17l0,0    C2315,5798.4,2322.6,5806,2322.6,5815.4z",
		"ld": "M2288,5815.8 1994.1,5815.4 1949,5700.7 1094.3,5703.9",
		"ad": "M1030.6,5704.5c29.9-11.9,66.9-32,89.8-53.2l-17.7,52.5l18.6,52.1C1098,5735.2,1060.7,5715.8,1030.6,5704.5z"
	},
	{
		key: 6,
		"cd": "M2322.6,5503.9c0,9.4-7.6,17-17,17c-9.4,0-17-7.6-17-17s7.6-17,17-17l0,0    C2315,5486.9,2322.6,5494.5,2322.6,5503.9z",
		"ld": "M2288,5504.4 1994.1,5503.9 1949,5389.3 1094.3,5392.5",
		"ad": "M1030.6,5393.1c29.9-11.9,66.9-32,89.8-53.2l-17.7,52.5l18.6,52.1C1098,5423.8,1060.7,5404.4,1030.6,5393.1z"
	},
	{
		key: 5,
		"cd": "M2289.6,5285.6c0-9.8,7.6-17.7,17-17.7c9.4,0,17,7.9,17,17.7s-7.6,17.7-17,17.7l0,0    C2297.2,5303.3,2289.6,5295.4,2289.6,5285.6z",
		"ld": "M2306.7,5284.7 2074.9,5284.7 1977,5458.4 1102.1,5457.7",
		"ad": "M1058.6,5457.7c30-11.6,67.2-31.4,90.2-52.3l-18.1,52.3l18.1,52.3     C1125.8,5489.1,1088.6,5469.3,1058.6,5457.7z"
	},
	{
		key: 4,
		"cd": "M2322.6,4983.3c0,9.4-7.6,17-17,17c-9.4,0-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0    C2315,4966.3,2322.6,4973.9,2322.6,4983.3z",
		"ld": "M2288,4983.8 1994.1,4983.3 1949,4868.7 1560.1,4872.6",
		"ad": "M1496.4,4873.2c29.9-11.9,66.9-32,89.8-53.2l-17.7,52.5l18.6,52.1     C1563.8,4903.9,1526.5,4884.5,1496.4,4873.2z"
	},
	{
		key: 3,
		"cd": "M2289.6,4453.6c0-9.8,7.6-17.7,17-17.7c9.4,0,17,7.9,17,17.7s-7.6,17.7-17,17.7l0,0    C2297.2,4471.3,2289.6,4463.4,2289.6,4453.6z",
		"ld": "M2306.7,4452.7 1666.8,4453.6 1546.8,4612.8 1137.8,4612.8",
		"ad": "M1094.3,4612.8c30-11.6,67.2-31.4,90.2-52.3l-18.1,52.3l18.1,52.3     C1161.5,4644.2,1124.3,4624.4,1094.3,4612.8z"
	},
	{
		key: 2,
		"cd": "M2322.6,4176.6c0,9.4-7.6,17-17,17c-9.4,0-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0    C2315,4159.6,2322.6,4167.2,2322.6,4176.6z",
		"ld": "M2288,4177.1 1994.1,4176.6 1949,4062 1302.5,4062.1",
		"ad": "M1238.9,4062.7c29.9-11.9,66.9-32,89.8-53.2L1311,4062l18.6,52.1C1306.3,4093.4,1268.9,4074,1238.9,4062.7z"
	},
	{
		key: 1,
		"cd": "M2322.6,3865.2c0,9.4-7.6,17-17,17c-9.4,0-17-7.6-17-17c0-9.4,7.6-17,17-17l0,0    C2315,3848.2,2322.6,3855.8,2322.6,3865.2z",
		"ld": "M2288,3865.7 1994.1,3865.2 1949,3750.6 1302.5,3750.7",
		"ad": "M1238.9,3751.3c29.9-11.9,66.9-32,89.8-53.2l-17.7,52.5l18.6,52.1C1306.3,3782,1268.9,3762.6,1238.9,3751.3z"
	},
	{
		key: 0,
		"cd": "M2289.6,3421.8c0-9.8,7.6-17.7,17-17.7c9.4,0,17,7.9,17,17.7s-7.6,17.7-17,17.7l0,0    C2297.2,3439.5,2289.6,3431.6,2289.6,3421.8z",
		"ld": "M2306.7,3420.9 2074.9,3420.9 1977,3594.6 1310.4,3590.8",
		"ad": "M1266.8,3590.8c30-11.6,67.2-31.4,90.2-52.3l-18.1,52.3l18.1,52.3     C1334.1,3622.2,1296.8,3602.4,1266.8,3590.8z"
	}
];

const FRContentBoxes = [
	{
		key: 9,
		"cd": "M3362,6399.4c0,9.8,7.6,17.7,17,17.7c9.4,0,17-7.9,17-17.7s-7.6-17.7-17-17.7l0,0    C3369.6,6381.6,3362,6389.6,3362,6399.4z",
		"ld": "M3379.1,6400.3 3147.3,6400.3 3049.4,6226.6 2382.8,6230.4",
		"ad": "M2339.3,6230.4c30,11.6,67.2,31.4,90.2,52.3l-18.1-52.3l18.1-52.3C2406.5,6199,2369.2,6218.8,2339.3,6230.4z"
	},
	{
		key: 8,
		"cd": "M3395,5955.9c0-9.4-7.6-17-17-17c-9.4,0-17,7.6-17,17s7.6,17,17,17l0,0    C3387.4,5972.9,3395,5965.3,3395,5955.9z",
		"ld": "M3360.4,5955.5 3066.5,5955.9 3021.4,6070.6 2374.9,6070.5",
		"ad": "M2311.3,6069.9c29.9,11.9,66.9,32,89.8,53.2l-17.7-52.5l18.6-52.1     C2378.7,6039.2,2341.3,6058.6,2311.3,6069.9z"
	},
	{
		key: 7,
		"cd": "M3395,5644.5c0-9.4-7.6-17-17-17c-9.4,0-17,7.6-17,17s7.6,17,17,17l0,0    C3387.4,5661.5,3395,5653.9,3395,5644.5z",
		"ld": "M3360.4,5644.1 3066.5,5644.5 3021.4,5759.1 2374.9,5759.1",
		"ad": "M2311.3,5758.5c29.9,11.9,66.9,32,89.8,53.2l-17.7-52.5l18.6-52.1     C2378.7,5727.8,2341.3,5747.2,2311.3,5758.5z"
	},
	{
		key: 6,
		"cd": "M3362,5367.6c0,9.8,7.6,17.7,17,17.7c9.4,0,17-7.9,17-17.7s-7.6-17.7-17-17.7l0,0    C3369.6,5349.9,3362,5357.8,3362,5367.6z",
		"ld": "M3379.1,5368.5 2739.2,5367.6 2619.2,5208.3 2210.2,5208.3",
		"ad": "M2166.7,5208.3c30,11.6,67.2,31.4,90.2,52.3l-18.1-52.3l18.1-52.3     C2233.9,5176.9,2196.7,5196.7,2166.7,5208.3z"
	},
	{
		key: 5,
		"cd": "M3395,4837.8c0-9.4-7.6-17-17-17c-9.4,0-17,7.6-17,17s7.6,17,17,17l0,0    C3387.4,4854.8,3395,4847.2,3395,4837.8z",
		"ld": "M3360.4,4837.4 3066.5,4837.8 3021.4,4952.5 2632.5,4948.5",
		"ad": "M2568.9,4947.9c29.9,11.9,66.9,32,89.8,53.2l-17.7-52.5l18.6-52.1     C2636.2,4917.2,2598.9,4936.6,2568.9,4947.9z"
	},
	{
		key: 4,
		"cd": "M3362,4535.5c0,9.8,7.6,17.7,17,17.7c9.4,0,17-7.9,17-17.7s-7.6-17.7-17-17.7l0,0    C3369.6,4517.8,3362,4525.7,3362,4535.5z",
		"ld": "M3379.1,4536.4 3147.3,4536.4 3049.4,4362.7 2174.6,4363.5",
		"ad": "M2131,4363.5c30,11.6,67.2,31.4,90.2,52.3l-18.1-52.3l18.1-52.3C2198.2,4332.1,2161,4351.9,2131,4363.5z"
	},
	{
		key: 3,
		"cd": "M3395,4317.2c0-9.4-7.6-17-17-17c-9.4,0-17,7.6-17,17c0,9.4,7.6,17,17,17l0,0    C3387.4,4334.2,3395,4326.6,3395,4317.2z",
		"ld": "M3360.4,4316.8 3066.5,4317.2 3021.4,4431.8 2166.7,4428.7",
		"ad": "M2103.1,4428.1c29.9,11.9,66.9,32,89.8,53.2l-17.7-52.5l18.6-52.1     C2170.5,4397.4,2133.1,4416.8,2103.1,4428.1z"
	},
	{
		key: 2,
		"cd": "M3395,4005.8c0-9.4-7.6-17-17-17c-9.4,0-17,7.6-17,17c0,9.4,7.6,17,17,17l0,0    C3387.4,4022.8,3395,4015.2,3395,4005.8z",
		"ld": "M3360.4,4005.4 3066.5,4005.8 3021.4,4120.4 2166.7,4117.2",
		"ad": "M2103.1,4116.6c29.9,11.9,66.9,32,89.8,53.2l-17.7-52.5l18.6-52.1     C2170.5,4085.9,2133.1,4105.3,2103.1,4116.6z"
	},
	{
		key: 1,
		"cd": "M3362,3773c0,9.8,7.6,17.7,17,17.7c9.4,0,17-7.9,17-17.7s-7.6-17.7-17-17.7l0,0    C3369.6,3755.3,3362,3763.2,3362,3773z",
		"ld": "M3379.1,3773.9 3147.3,3773.9 3049.4,3600.2 2174.6,3600.9",
		"ad": "M2131,3600.9c30,11.6,67.2,31.4,90.2,52.3l-18.1-52.3l18.1-52.3C2198.2,3569.5,2161,3589.3,2131,3600.9z"
	},
	{
		key: 0,
		"cd": "M3395,3436.9c0-9.4-7.6-17-17-17c-9.4,0-17,7.6-17,17c0,9.4,7.6,17,17,17l0,0    C3387.4,3453.9,3395,3446.3,3395,3436.9z",
		"ld": "M3360.4,3436.5 3066.5,3436.9 3021.4,3551.5 2166.7,3548.3",
		"ad": "M2103.1,3547.7c29.9,11.9,66.9,32,89.8,53.2l-17.7-52.5l18.6-52.1C2170.5,3517,2133.1,3536.4,2103.1,3547.7z"
	}
]

const SVGLine = (props) => {
	try {
		const percentToSVGX = (x) => {
			if (props.cRef.current === null) {
				return 0
			}
			if (props.x < 50) {
				return (VIEWBOX_WIDTH / 100 * (x + props.cRef.current.offsetWidth / props.pageWidth * 100))
			}
			else {
				return (VIEWBOX_WIDTH / 100 * x)
			}
		}
		const percentToSVGY = (y) => {
			if (props.cRef.current === null) {
				return 0
			} else {
				return (VIEWBOX_HEIGHT / 100 * (y + props.cRef.current.offsetHeight / props.pageHeight * 50));
			}
		}


		const ldPointsToSVGStringReducer = (svgString, tuple, index) => (
			index === 0 ? svgString + `M${tuple[0]},${tuple[1]}` : svgString + " " + `${tuple[0]},${tuple[1]}`
		)

		// The first thing we need to do is place the arrow in the correct position. Get the move position of the arrow
		const adArray = props.ad.split(",")
		const arrowShiftX = adArray[0].substring(1) //M<number>
		const arrowShiftY = adArray[1].substring(0, adArray[1].indexOf("c")) //<number>c<number>

		const ldPoints = new Array();
		// Get lds to transform them
		props.ld.split(" ").forEach((pair, _) => {
			let [x, y] = String(pair).replace('M', '').split(",");
			x = Number(x);
			y = Number(y);
			if (!isNaN(x) && !isNaN(y)) {
				ldPoints.push([x, y]);
			}
		})

		// Now get the svg coordinate position of the middle of the box. Right side for x < 50. left side for X > 50
		const contentPosX = percentToSVGX(props.x);
		const contentPosY = percentToSVGY(props.y);



		return (
			<g id={props.id} data-name={props.id}>
				<path id={`circle-${props.id}`} className="st5" d={props.cd} />
				<g>
					<path className="st6" d={ldPoints.reduce(ldPointsToSVGStringReducer, "")} />
					<path className="st7" d={props.ad} transform={`translate(${contentPosX - arrowShiftX} ${contentPosY - arrowShiftY})`} />
				</g>
			</g>)
	}
	catch (ex) { return null }
}



const VIEWBOX_WIDTH = 3658.6;
const VIEWBOX_HEIGHT = 6486.5;

export default function About2(props) {
	const [pageWidth, setPageWidth] = useState(0);
	const [pageHeight, setPageHeight] = useState(0);
	const pageRef = useRef(null);
	const contentBoxRefs = ContentBoxes.map(() => useRef(null));
	const FLContentBoxRefs = FLContentBoxes.map(() => useRef(null));
	const NLContentBoxRefs = NLContentBoxes.map(() => useRef(null));
	const NRContentBoxRefs = NRContentBoxes.map(() => useRef(null));
	const FRContentBoxRefs = FRContentBoxes.map(() => useRef(null));
	useEffect(() => {
		setPageWidth(pageRef.current.offsetWidth)
		setPageHeight(pageRef.current.offsetHeight)
	}, [])
	return (
		<StyledPage ref={pageRef}>
			{ContentBoxes.map((props, i) => <ContentBox key={`Main-${props.key}`} boxRef={contentBoxRefs[props.key]} {...props} />)}
			{FLContentBoxes.map((props, i) => <ContentBox key={`FL-${props.key}`} boxRef={FLContentBoxRefs[props.key]} {...props} />)}
			{NLContentBoxes.map((props, i) => <ContentBox key={`NL-${props.key}`} boxRef={NLContentBoxRefs[props.key]} {...props} />)}
			{NRContentBoxes.map((props, i) => <ContentBox key={`NR-${props.key}`} boxRef={NRContentBoxRefs[props.key]} {...props} />)}
			{FRContentBoxes.map((props, i) => <ContentBox key={`FR-${props.key}`} boxRef={FRContentBoxRefs[props.key]} {...props} />)}
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
				viewBox="0 0 3658.6 6486.5" preserveAspectRatio="none">
				<path id="FR" class="st0" d="M1807,2976.3l1571.9,266.9l-2.6,3243.2" />
				<path id="NL" class="st1" d="M1814.1,2976.3l-503.4,210.9l4.3,3299.2" />
				<path id="NR" class="st2" d="M1814.7,2974.9l489.4,210.9l3.7,3300.7" />
				<path id="FL" class="st3" d="M1818.9,2976.7L249,3243.2l-2.6,3243.2" />
				<path id="RedLine_4_" class="st4" d="M1728.4,0v101.8l-66.8,43.2v4.1V809l150,224.6l2.6,1964.4" />
				<g id="Main">
					{ContentBoxes.map((props, i) => <SVGLine key={`Main-${props.key}`} cRef={contentBoxRefs[props.key]} {...props} pageWidth={pageWidth} pageHeight={pageHeight} />)}
				</g>
				<g id="FL_4_">
					{FLContentBoxes.map((props, i) => <SVGLine key={`FL-${props.key}`} cRef={FLContentBoxRefs[props.key]} {...props} pageWidth={pageWidth} pageHeight={pageHeight} />)}
				</g>
				<g id="NL_1_">
					{NLContentBoxes.map((props, i) => <SVGLine key={`NL-${props.key}`} cRef={NLContentBoxRefs[props.key]} {...props} pageWidth={pageWidth} pageHeight={pageHeight} />)}
				</g>
				<g id="NR_1_">
					{NRContentBoxes.map((props, i) => <SVGLine key={`NR-${props.key}`} cRef={NRContentBoxRefs[props.key]} {...props} pageWidth={pageWidth} pageHeight={pageHeight} />)}
				</g>
				<g id="FR_1_">
					{FRContentBoxes.map((props, i) => <SVGLine key={`FR-${props.key}`} cRef={FRContentBoxRefs[props.key]} {...props} pageWidth={pageWidth} pageHeight={pageHeight} />)}
				</g>
			</svg>


		</StyledPage>);
}