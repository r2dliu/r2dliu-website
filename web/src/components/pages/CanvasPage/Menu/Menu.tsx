import React, { SyntheticEvent } from "react";
import Button from "@material-ui/core/Button";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
// import {
// 	HomeOutlined,
// 	InfoOutlined,
// 	WorkOutline,
// 	FeaturedPlayListOutlined,
// 	VideogameAssetOutlined,
// 	ContactSupportOutlined,
// } from "@material-ui/icons";

import HomeOutlined from "@material-ui/icons/HomeOutlined";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import WorkOutline from "@material-ui/icons/WorkOutline";
import FeaturedPlayListOutlined from "@material-ui/icons/FeaturedPlayListOutlined";
import VideogameAssetOutlined from "@material-ui/icons/VideogameAssetOutlined";
import ContactSupportOutlined from "@material-ui/icons/ContactSupportOutlined";

import withNavigation from "components/helpers/withNavigation";
import NavigatingContextInterface from "components/helpers/NavigatingContextInterface";

import Spacer from "../../../Spacer";
import styles from "./Menu.module.scss";

interface Props extends RouteComponentProps, NavigatingContextInterface {
	page: string;
	isMobile: boolean;
	closeMenu?: () => void;
}

function Menu(props: Props) {
	const { page, isMobile, closeMenu, setIsNavigating } = props;

	const redirect = (e: SyntheticEvent) => {
		let buttonName = (e.currentTarget as HTMLElement).id;
		if (buttonName !== page) {
			if (buttonName === "home") {
				buttonName = "";
			}
			if (closeMenu) {
				closeMenu();
			}
			setIsNavigating(true);
			setTimeout(() => props.history.push(`/${buttonName}`), 800);
		}
	};

	return (
		<div className={cn(styles.Menu, { [styles.mobile]: isMobile })}>
			<Button
				id="home"
				className={cn(styles.menuItem, styles.firstItem)}
				onClick={redirect}
			>
				<div>
					<HomeOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Home</div>
			</Button>
			<Spacer size="md" />
			<Button
				id="about"
				className={cn(styles.menuItem, styles.secondItem, {
					[styles.highlight]: page === "about"
				})}
				onClick={redirect}
			>
				<div>
					<InfoOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>About Me</div>
			</Button>
			<Spacer size="md" />
			<Button
				id="projects"
				className={cn(styles.menuItem, styles.thirdItem, {
					[styles.highlight]: page === "projects"
				})}
				onClick={redirect}
			>
				<div>
					<WorkOutline className={styles.icon} />
				</div>
				<div className={styles.iconText}>Projects</div>
			</Button>
			<Spacer size="md" />
			<Button
				id="articles"
				className={cn(styles.menuItem, styles.fourthItem, {
					[styles.highlight]: page === "articles"
				})}
				onClick={redirect}
			>
				<div>
					<FeaturedPlayListOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Articles</div>
			</Button>
			<Spacer size="md" />
			<Button
				id="melee"
				className={cn(styles.menuItem, styles.fifthItem, {
					[styles.highlight]: page === "melee"
				})}
				onClick={redirect}
			>
				<div>
					<VideogameAssetOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Melee</div>
			</Button>
			<Spacer size="md" />
			<Button
				id="contact"
				className={cn(styles.menuItem, styles.sixthItem, {
					[styles.highlight]: page === "contact"
				})}
				onClick={redirect}
			>
				<div>
					<ContactSupportOutlined className={styles.icon} />
				</div>
				<div className={styles.iconText}>Contact</div>
			</Button>
		</div>
	);
}

export default withNavigation(withRouter(Menu));
