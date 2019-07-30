import React from "react";
import Image from "components/Image";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import withNavigation from "components/helpers/withNavigation";
import NavigatingContextInterface from "components/helpers/NavigatingContextInterface";
import styles from "./ProjectCard.module.scss";

interface Props extends RouteComponentProps, NavigatingContextInterface {
	background: string;
	previewBackground: string;
	title: string;
	description: string;
	height: string;
	width: string;
}

function ProjectCard(props: Props) {
	const {
		background,
		previewBackground,
		title,
		description,
		width,
		height
	} = props;

	return (
		<div className={styles.ProjectCard}>
			<div className={styles.image}>
				<Image
					width={width}
					height={height}
					src={background}
					preview={previewBackground}
				/>
			</div>
			<div className={styles.titleContainer}>
				<div className={styles.title}>{title}</div>
			</div>
			<div className={styles.descriptionContainer}>
				<div className={styles.description}>{description}</div>
			</div>
		</div>
	);
}

export default withNavigation(withRouter(ProjectCard));
