import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import cn from "classnames";
import { Link } from "react-router-dom";

import styles from "./HomePage.module.scss";
import { number } from "prop-types";

function HomePage() {
	const [isClicked, setIsClicked] = useState(false);

	const testFunction = () => {
		console.log("test animation");
	};

	const testOnClick = () => {
		console.log("clicked");
	};

	const buttonClassNames = cn(styles.button, {
		[styles.clicked]: isClicked,
	});

	return (
		<div className={styles.Home}>
			<div>
				<div className={styles.title}>David Liu</div>
				<div className={styles.description}>Developer | Designer | Player</div>
				<Button
					className={styles.button}
					variant="outlined"
					onAnimationEnd={testFunction}
					onClick={testOnClick}
				>
					{"About Me"}
				</Button>
			</div>
		</div>
	);
}

export default HomePage;
