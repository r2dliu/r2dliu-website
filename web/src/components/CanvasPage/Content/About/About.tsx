// import React, { useState, useEffect, Fragment } from "react";
import React from "react";
import Link from "@material-ui/core/Link";
import styles from "./About.module.scss";

function CanvasPage() {
	// const [isLoaded, setIsLoaded] = useState(false);
	// useEffect(() => {
	// 	setIsLoaded(true);
	// }, []);

	// https://i.imgur.com/cqCaKCc.png

	return (
		<div className={styles.About}>
			<div className={styles.cardContainer}>
				<div className={styles.profileCard} >
					<div className={styles.main}>
						<div className={styles.pictureContainer} >
							<div className={styles.picture} />
						</div>
						<div className={styles.descriptionContainer}>
							<div className={styles.description}>
								<div className={styles.header}>About Me</div>
								<div className={styles.body}>
									<div>Name: Zhiyuan Liu, preferred first name David. Chinese: 刘致远</div>
									<div>Age: 23</div>
									<div>DOB: February 29th, 1996</div>
									<div>Email: zliu3301@gmail.com</div>
									<div>Phone: (302) 824-5107</div>
									<div>Skilled in: Javascript, Python, C++, PHP</div>
									<div>Hobbies: Melee, Bouldering, Tennis, Programming</div>
								</div>
							</div>
							<div className={styles.work}>
								<div className={styles.header}>Recent Work</div>
								<div className={styles.body}>
									<Link
										className={styles.link}
										href="https://smash.gg"
										target="_blank"
									>
										{"smash.gg: May 2018 - July 2019"}
									</Link>
									{"A web application and tool designed to empower esports "}
									{"communites through competitive structure and enabling easy, intuitive event "}
									{"organization"}
								</div>
							</div>
						</div>
					</div>
					<div className={styles.social}>
						social
					</div>
				</div>
			</div>
		</div >
	);
}

export default CanvasPage;
