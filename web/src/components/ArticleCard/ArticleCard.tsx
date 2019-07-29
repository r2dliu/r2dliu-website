import React, { SyntheticEvent } from "react";
import cn from "classnames";
import Image from "components/Image";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import withNavigation from "components/helpers/withNavigation";
import NavigatingContextInterface from "components/helpers/NavigatingContextInterface";
import styles from "./ArticleCard.module.scss";

interface Props extends RouteComponentProps, NavigatingContextInterface {
	articleId: string;
	background: string;
	previewBackground: string;
	title: string;
	description: string;
	height: string;
	width: string;
}

function ArticleCard(props: Props) {
	const {
		articleId,
		background,
		previewBackground,
		title,
		description,
		width,
		height
	} = props;

	const redirect = (e: SyntheticEvent) => {
		props.setIsNavigating(true);
		setTimeout(() => props.history.push(`/articles/${articleId}`), 800);
	};

	return (
		<div className={styles.ArticleCard} onClick={redirect}>
			<div className={styles.image}>
				<Image
					width={width}
					height={height}
					src={background}
					preview={previewBackground}
				/>
			</div>
			<div className={styles.label}>
				<div className={styles.title}>{title}</div>
				<div className={styles.description}>{description}</div>
			</div>
		</div>
	);
}

export default withNavigation(withRouter(ArticleCard));
