import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";

import styles from "./CanvasPage.module.scss";

interface Props extends RouteComponentProps<{ page: string }> { }

function CanvasPage(props: Props) {
	const [isClicked, setIsClicked] = useState(false);

	const page = props.match.params;

	console.log(page);

	return (
		<div className={styles.CanvasPage}>
			<div className={styles.sideNav}>
				<div>test</div>
				<div>test2</div>
				<div>test3</div>
			</div>
			<div className={styles.canvas} />
		</div>
	);
}

export default CanvasPage;
