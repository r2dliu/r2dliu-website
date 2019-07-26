import React, { useState, useEffect } from "react";
import { get } from "lodash";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import Breakpoint from "react-socks";

import About from "./Content/About";
import Menu from "./Menu";
import styles from "./CanvasPage.module.scss";

function CanvasPage(props: RouteComponentProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const toggleMenuOpen = () => { setIsMenuOpen(!isMenuOpen); };

	const page = get(props.match, ["params", "id"], "");

	const getCanvasEl = (currPage: string) => {
		switch (currPage) {
			case "about":
				return <About />;
			default:
				return null;
		}
	};

	return (
		<div className={styles.CanvasPage}>
			<Breakpoint className={styles.mobile} xs={true} only={true}>
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
				<div
					className={cn(styles.menuOverlay, {
						[styles.show]: isMenuOpen,
					})}
				>
					<div className={styles.menu} >
						<Menu page={page} isMobile={true} />
					</div>
				</div>
				<div className={styles.canvas} />
			</Breakpoint>
			<Breakpoint className={styles.desktop} s={true} up={true}>
				<div className={cn(styles.sideNav, { [styles.loaded]: isLoaded })}>
					<Menu page={page} isMobile={false} />
				</div>
				<div className={styles.canvas}>
					<div className={styles.display}>
						{getCanvasEl(page)}
					</div>
				</div>
			</Breakpoint>
		</div>
	);
}

export default withRouter(CanvasPage);
