import React, { useState, useEffect, Fragment } from "react";
import { get } from "lodash";
import cn from "classnames";
import tocbot from "tocbot";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import Breakpoint, { useCurrentWidth } from "react-socks";
import withNavigation from "components/helpers/withNavigation";
import withTracking from "components/helpers/withTracking";

import Ledgedash from "./Articles/Ledgedash";
import styles from "./ArticlePage.module.scss";
import "./toc.scss";

interface Props extends RouteComponentProps {
	isNavigating: boolean;
	setIsNavigating: (bool: boolean) => void;
}

function ArticlePage(props: Props) {
	const { isNavigating, setIsNavigating } = props;
	const [isLoaded, setIsLoaded] = useState(false);

	const currentWidth = useCurrentWidth();

	tocbot.init({
		// Where to render the table of contents.
		tocSelector: ".toc",
		// Where to grab the headings to build the table of contents.
		contentSelector: ".scrollContainer",
		// Which headings to grab inside of the contentSelector element.
		headingSelector: "h1, h2, h3",
		// For headings inside relative or absolute positioned containers within content.
		hasInnerContainers: true,
		scrollContainer: ".scrollContainer"
	});

	useEffect(() => {
		setIsLoaded(true);
		setIsNavigating(false);
		return () => setIsLoaded(false);
	}, [props.match, setIsNavigating, currentWidth]);

	const article = get(props.match, ["params", "id"], "");

	const getArticleTitle = (article: string) => {
		switch (article) {
			case "ledgedash":
				return "Optimal Ledgedashing";
			default:
				return null;
		}
	};

	const articleTitle = getArticleTitle(article);

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
				s={true}
				down={true}
			>
				<div className={cn(styles.titleContainer, styles.mobile)}>
					<div className={styles.left} />
					<div className={cn(styles.title)}>{articleTitle}</div>
					<div className={styles.right} />
				</div>
				{getArticleEl(article, true)}
			</Breakpoint>
			<Breakpoint className={styles.page} m={true} up={true}>
				<div className={styles.sidebar}>
					<div className={styles.tocWrapper}>
						<div className="toc"></div>
					</div>
				</div>
				<div
					className={cn(styles.ArticlePage, "tocContent", {
						[styles.loaded]: isLoaded,
						[styles.navigating]: isNavigating
					})}
				>
					<div className={styles.titleContainer}>
						<div className={cn("title", styles.title)}>
							{articleTitle}
						</div>
					</div>
					{getArticleEl(article, false)}
				</div>
			</Breakpoint>
		</Fragment>
	);
}

export default withTracking(withNavigation(withRouter(ArticlePage)));
