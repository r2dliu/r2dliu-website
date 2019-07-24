import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import cn from "classnames";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";

import styles from "./HomePage.module.scss";

interface Props extends RouteComponentProps<any> { }

function HomePage(props: Props) {
	const [isClicked, setIsClicked] = useState(false);
	const [isAnimationDone, setIsAnimationDone] = useState(false);
	const markAnimationFinished = () => {
		console.log("animation done");
		setIsAnimationDone(true);
	};

	const markClicked = () => {
		setIsClicked(true);
	};

	const getClickedClassNames = (classNames: string) => cn(classNames, {
		[styles.clicked]: isClicked,
	});

	if (isAnimationDone) {
		props.history.push("/");
		return <Redirect to="/about" />;
	}

	return (
		<div onAnimationEnd={markAnimationFinished} className={styles.Home}>
			<div className={getClickedClassNames(styles.title)}>David Liu</div>
			<div className={getClickedClassNames(styles.description)}>Developer | Designer | Player</div>
			<Button
				className={getClickedClassNames(styles.button)}
				variant="outlined"
				onClick={markClicked}
				disabled={isClicked}
			>
				<div className={styles.buttonContent}>{"About Me"}</div>
			</Button>
		</div>
	);
}

export default withRouter(HomePage);
