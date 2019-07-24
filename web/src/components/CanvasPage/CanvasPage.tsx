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

import Spacer from "../Spacer";
import styles from "./CanvasPage.module.scss";
import Breakpoint from "react-socks";

interface Props extends RouteComponentProps<{ page: string }> { }

function CanvasPage(props: Props) {
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const page = props.match.params;

	return (
		<div className={styles.CanvasPage}>
			<Breakpoint s={true} down={true}>
				<div className={styles.mobile} >
					<div className={styles.mobileNav} >
						{"test"}
					</div>
					<div className={styles.canvas} />
				</div>
			</Breakpoint>
			<Breakpoint m={true} up={true}>
				<div className={styles.desktop} >
					<div className={cn(styles.sideNav, { [styles.loaded]: isLoaded })}>
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
					</div>
					<div className={styles.canvas} />
				</div>
			</Breakpoint>

		</div >
	);
}

export default withRouter(CanvasPage);
