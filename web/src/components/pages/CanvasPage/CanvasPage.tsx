import React, { useState, useEffect } from "react";
import { get } from "lodash";
import cn from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import Breakpoint from "react-socks";

import withNavigation from "components/helpers/withNavigation";
import About from "./Content/About";
import Melee from "./Content/Melee";
import Articles from "./Content/Articles";
import Menu from "./Menu";
import styles from "./CanvasPage.module.scss";

interface Props extends RouteComponentProps {
	isNavigating: boolean;
	setIsNavigating: (bool: boolean) => void;
}

function CanvasPage(props: Props) {
	const { isNavigating, setIsNavigating } = props;

	const [isLoaded, setIsLoaded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
		setIsNavigating(false);
		return () => setIsLoaded(false);
	}, [props.match]);

	const toggleMenuOpen = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const page = get(props.match, ["params", "id"], "");

	const getCanvasEl = (currPage: string) => {
		switch (currPage) {
			case "about":
				return <About />;
			case "articles":
				return <Articles />;
			case "melee":
				return <Melee />;
			default:
				return null;
		}
	};

	return (
		<div className={styles.CanvasPage}>
			<Breakpoint className={styles.mobile} xs={true} only={true}>
				<div
					className={cn(styles.mobileNav, {
						[styles.loaded]: isLoaded
					})}
				>
					<button
						className={cn(
							styles.hamburger,
							styles.hamburgerSlider,
							{ [styles.isActive]: isMenuOpen }
						)}
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
						[styles.show]: isMenuOpen
					})}
				>
					<div className={styles.menu}>
						<Menu
							page={page}
							isMobile={true}
							closeMenu={toggleMenuOpen}
						/>
					</div>
				</div>
				<div
					className={cn(styles.canvas, {
						[styles.loaded]: isLoaded,
						[styles.navigating]: isNavigating,
						[styles.menuOpen]: isMenuOpen
					})}
				>
					{getCanvasEl(page)}
				</div>
			</Breakpoint>
			<Breakpoint className={styles.desktop} s={true} up={true}>
				<div
					className={cn(styles.sideNav, {
						[styles.loaded]: isLoaded
					})}
				>
					<Menu page={page} isMobile={false} />
				</div>
				<div
					className={cn(styles.canvas, {
						[styles.loaded]: isLoaded,
						[styles.navigating]: isNavigating
					})}
				>
					<div className={styles.display}>{getCanvasEl(page)}</div>
				</div>
			</Breakpoint>
		</div>
	);
}

export default withNavigation(withRouter(CanvasPage));
