import React, { useState, useEffect } from "react";
import { get } from "lodash";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";

import DesktopMenu from "./DesktopMenu";
import styles from "./CanvasPage.module.scss";
import Breakpoint from "react-socks";

function CanvasPage(props: RouteComponentProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const toggleMenuOpen = () => { setIsMenuOpen(!isMenuOpen); };

	const page = get(props.match, ["params", "id"], "");

	return (
		<div className={styles.CanvasPage}>
			<Breakpoint className={styles.mobile} s={true} down={true}>
				<div className={cn(styles.mobileNav, { [styles.loaded]: isLoaded })}  >
					<button
						className={cn(styles.hamburger, styles.hamburgerSlider, { [styles.isActive]: isMenuOpen })}
						type="button"
						onClick={toggleMenuOpen}
					>
						<span className={styles.hamburgerBox}>
							<span className={styles.hamburgerInner} />
						</span>
					</button>
				</div>
				{isMenuOpen && <div className={styles.menuOverlay}>
					<div className={styles.menu} >
						<DesktopMenu page={page} isMobile={true} />
					</div>
				</div>}
				<div className={styles.canvas} />
			</Breakpoint>
			<Breakpoint className={styles.desktop} m={true} up={true}>
				<div className={cn(styles.sideNav, { [styles.loaded]: isLoaded })}>
					<DesktopMenu page={page} isMobile={false} />
				</div>
				<div className={styles.canvas} />
			</Breakpoint>
		</div>
	);
}

export default withRouter(CanvasPage);
