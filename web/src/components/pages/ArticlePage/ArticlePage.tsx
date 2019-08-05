import React, { useState, useEffect, Fragment } from "react";
import { get } from "lodash";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import Breakpoint from "react-socks";
import withNavigation from "components/helpers/withNavigation";

import Ledgedash from "./Articles/Ledgedash";
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
	}, [props.match, setIsNavigating]);

	const article = get(props.match, ["params", "id"], "");

	const getArticleTitle = (article: string) => {
		switch (article) {
			case "ledgedash":
				return "Optimal Ledgedashing";
			default:
				return null;
		}
	};

	const getArticleEl = (article: string, isMobile: boolean) => {
		let element;
		switch (article) {
			case "ledgedash":
				element = <Ledgedash />;
				break;
			default:
				return null;
		}

		return (
			<div
				className={cn(styles.canvas, {
					[styles.mobile]: isMobile
				})}
			>
				{element}
			</div>
		);
	};

	return (
		<Fragment>
			<Breakpoint
				className={cn(styles.ArticlePage, {
					[styles.loaded]: isLoaded,
					[styles.navigating]: isNavigating
				})}
				xs={true}
				only={true}
			>
				<div className={cn(styles.titleContainer, styles.mobile)}>
					<div className={styles.left} />
					<div className={cn(styles.title)}>
						{getArticleTitle(article)}
					</div>
					<div className={styles.right} />
				</div>
				{getArticleEl(article, true)}
			</Breakpoint>
			<Breakpoint
				className={cn(styles.ArticlePage, {
					[styles.loaded]: isLoaded,
					[styles.navigating]: isNavigating
				})}
				s={true}
				up={true}
			>
				<div className={styles.titleContainer}>
					<div className={styles.title}>
						{getArticleTitle(article)}
					</div>
				</div>
				{getArticleEl(article, false)}
			</Breakpoint>
		</Fragment>
	);
}

export default withNavigation(withRouter(ArticlePage));
