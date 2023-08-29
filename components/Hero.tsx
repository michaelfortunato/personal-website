import React, { useState } from "react";
import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";
import Description from "./Description";
import Name from "./Name";

const StyledBanner = styled.div`
	position: relative;
	top: 16%;
`;

export default function Hero(props: { triggerNameEnter: boolean }) {
	let [nameEntered, setNameEntered] = useState(false);

	return (
		<Grid
			container
			style={{ height: "90vh" }}
			justifyContent="center"
			alignItems="center"
		>
			<Grid item>
				<StyledBanner>
					<Name
						firstName="Michael"
						lastName="Fortunato"
						startAnimation={props.triggerNameEnter}
						onAnimationFinish={setNameEntered}
					/>
					{nameEntered ? <Description /> : null}
				</StyledBanner>
			</Grid>
		</Grid>
	);
}
