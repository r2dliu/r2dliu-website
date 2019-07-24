import React, { useState, useEffect } from "react";
// import Button from "@material-ui/core/Button";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import {
	HomeOutlined,
	InfoOutlined,
	WorkOutline,
	FeaturedPlayListOutlined,
	VideogameAssetOutlined,
	ContactSupportOutlined,
} from "@material-ui/icons";

import Spacer from "../../Spacer";
import styles from "./CanvasPage.module.scss";

interface Props extends RouteComponentProps<{ page: string }> { }

function DesktopMenu(props: Props) {
	return (
		<div className={styles.menu}>
			<div className={styles.menuItem}>
				<div>
					<HomeOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Home</div>
			</div>
			<Spacer size="md" />
			<div className={styles.menuItem}>
				<div>
					<InfoOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>About Me</div>
			</div>
			<Spacer size="md" />
			<div className={styles.menuItem}>
				<div>
					<WorkOutline className={styles.icon} />
				</div>
				<div className={styles.iconText}>Projects</div>
			</div>
			<Spacer size="md" />
			<div className={styles.menuItem}>
				<div>
					<FeaturedPlayListOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Articles</div>
			</div>
			<Spacer size="md" />
			<div className={styles.menuItem}>
				<div>
					<VideogameAssetOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Melee</div>
			</div>
			<Spacer size="md" />
			<div className={styles.menuItem}>
				<div>
					<ContactSupportOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Contact</div>
			</div>
		</div>
	);
}

export default withRouter(DesktopMenu);
