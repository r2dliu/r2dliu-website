import React, { Fragment } from "react";
import Breakpoint from "react-socks";

import Desktop from "./Desktop";
import Mobile from "./Mobile";

function About() {
	return (
		<Fragment>
			<Breakpoint xs={true} only={true}>
				<Mobile />
			</Breakpoint>
			<Breakpoint s={true} up={true}>
				<Desktop />
			</Breakpoint>
		</Fragment>
	);
}

export default About;
