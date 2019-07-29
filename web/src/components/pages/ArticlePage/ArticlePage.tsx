import React, { useState, useEffect } from "react";
import { get } from "lodash";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import Breakpoint from "react-socks";
import withNavigation from "components/helpers/withNavigation";

import styles from "./ArticlePage.module.scss";

interface Props extends RouteComponentProps {
	isNavigating: boolean;
	setIsNavigating: (bool: boolean) => void;
}

function ArticlePage(props: Props) {
	const { isNavigating, setIsNavigating } = props;
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
		setIsNavigating(false);
		return () => setIsLoaded(false);
	}, [props.match]);

	const article = get(props.match, ["params", "id"], "");

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
				[styles.navigating]: isNavigating
			})}
		>
			<div className={styles.titleContainer}>
				<div className={styles.title}>Title here</div>
			</div>
			{/* <Breakpoint className={styles.mobile} xs={true} only={true}>

			</Breakpoint> */}
			<Breakpoint className={styles.desktop} s={true} up={true}>
				<div className={cn(styles.canvas)}>
					<div className={styles.display}>Articles tuff here</div>
				</div>
			</Breakpoint>
		</div>
	);
}

export default withNavigation(withRouter(ArticlePage));
