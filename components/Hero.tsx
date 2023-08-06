import React, { useState } from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Description from "./Description.js";
import Name from "./Name.js";

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
			<Grid item style={{ maxWidth: 700 }}>
				<StyledBanner>
					<Name
						firstName="Michael"
						lastName="Fortunato"
						triggerNameEnter={props.triggerNameEnter}
						nameEntered={nameEntered}
						setNameEntered={setNameEntered}
						location="/"
					/>
					{nameEntered ? <Description /> : null}
				</StyledBanner>
			</Grid>
		</Grid>
	);
}
