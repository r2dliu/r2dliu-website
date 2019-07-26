import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import cn from "classnames";
import { Redirect } from "react-router-dom";

import styles from "./HomePage.module.scss";

function HomePage() {
	const [isClicked, setIsClicked] = useState(false);
	const [isAnimationDone, setIsAnimationDone] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const markAnimationFinished = (e: AnimationEvent) => {
		if (e.animationName.includes("fade-out")) {
			setIsAnimationDone(true);
		}
	};

	const markClicked = () => {
		setIsClicked(true);
	};

	const getClickedClassNames = (classNames: string) => cn(classNames, {
		[styles.clicked]: isClicked,
	});

	if (isAnimationDone) {
		return <Redirect to="/about" />;
	}

	return (
		// @ts-ignore
		<div onAnimationEnd={markAnimationFinished} className={styles.Home}>
			<div
				className={cn(getClickedClassNames(styles.title), { [styles.loaded]: isLoaded })}
			>
				David Liu
			</div>
			<div
				className={cn(getClickedClassNames(styles.description), {
					[styles.loaded]: isLoaded,
				})}
			>
				Software | Design | Bouldering | Melee
			</div>
			<Button
				className={cn(getClickedClassNames(styles.button), { [styles.loaded]: isLoaded })}
				variant="outlined"
				onClick={markClicked}
				disabled={isClicked}
			>
				<div className={styles.buttonContent}>{"About Me"}</div>
			</Button>
		</div >
	);
}

export default HomePage;
