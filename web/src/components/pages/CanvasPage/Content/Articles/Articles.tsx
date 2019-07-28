import React, { Fragment } from "react";
import Breakpoint from "react-socks";

import Desktop from "./Desktop";
import Mobile from "./Mobile";

// this should really just be a component that takes in desktop and mobile as props
// TODO: cleanup
function Articles() {
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

export default Articles;
