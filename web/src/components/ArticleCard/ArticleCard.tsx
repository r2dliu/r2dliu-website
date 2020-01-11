import React from "react";
import Image from "components/Image";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import withNavigation from "components/helpers/withNavigation";
import NavigatingContextInterface from "components/helpers/NavigatingContextInterface";
import styles from "./ArticleCard.module.scss";

interface Props extends RouteComponentProps, NavigatingContextInterface {
	background: string;
	previewBackground: string;
	title: string;
	description: string;
	height: string;
	width: string;
	chiclet?: React.ReactNode;
}

function ArticleCard(props: Props) {
	const {
		background,
		previewBackground,
		title,
		description,
		width,
		height,
		chiclet
	} = props;

	return (
		<div className={styles.ArticleCard}>
			<div className={styles.image}>
				<Image
					width={width}
					height={height}
					src={background}
					preview={previewBackground}
				/>
			</div>
			<div className={styles.label}>
				<div className={styles.title}>
					<div className={styles.titleText}>{title}</div>
					{chiclet && <div>{chiclet}</div>}
				</div>
				<div className={styles.description}>{description}</div>
			</div>
		</div>
	);
}

export default withNavigation(withRouter(ArticleCard));
