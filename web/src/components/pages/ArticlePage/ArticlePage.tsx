import React, { useState, useEffect } from "react";
import { get } from "lodash";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import Breakpoint from "react-socks";

import styles from "./ArticlePage.module.scss";

function ArticlePage(props: RouteComponentProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isNavigating, setIsNavigating] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
		setIsNavigating(false);
		return () => setIsLoaded(false);
	}, [props.match]);


	const article = get(props.match, ["params", "id"], "");

	console.log(article);
	// const getCanvasEl = (currPage: string) => {
	// 	switch (currPage) {
	// 		case "about":
	// 			return <About />;
	// 		case "articles":
	// 			return <Articles />;
	// 		case "melee":
	// 			return <Melee />;
	// 		default:
	// 			return null;
	// 	}
	// };

	return (
		<div
			className={cn(styles.ArticlePage, {
				[styles.loaded]: isLoaded,
				[styles.navigating]: isNavigating,
			})}
		>
			{/* <Breakpoint className={styles.mobile} xs={true} only={true}>

			</Breakpoint> */}
			<Breakpoint className={styles.desktop} s={true} up={true}>
				<div className={styles.titleContainer}>
					<div className={styles.title}>
						Title here
					</div>
				</div>
				<div className={cn(styles.canvas)}>
					<div className={styles.display}>
						Articles tuff here
					</div>
				</div>
			</Breakpoint>
		</div>
	);
}

export default withRouter(ArticlePage);
