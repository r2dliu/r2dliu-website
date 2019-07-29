// import React, { useState, useEffect, Fragment } from "react";
import React from "react";
import Link from "@material-ui/core/Link";

import Image from "components/Image";
import styles from "./Melee.module.scss";
import Spacer from "components/Spacer";

function Melee() {
	const image = (
		<div className={styles.imageContainer}>
			<div className={styles.image}>
				<Image
					src="https://s3.r2dliu.com/assets/meleeProfile.jpg"
					width="200px"
					height="200px"
				/>
			</div>
		</div>
	);

	const egtvLink = (
		<Link
			className={styles.link}
			href="https://liquipedia.net/smash/EndGameTV"
		>
			{"EndGameTV"}
		</Link>
	);

	const ssbWikiLink = (
		<Link
			className={styles.link}
			href="https://www.ssbwiki.com/Smasher:R2DLiu"
		>
			{"See ssbwiki"}
		</Link>
	);

	const docKidLink = (
		<Link
			className={styles.link}
			href="https://web.archive.org/web/20171116085743/http://peekand.co/this-week-in-e-sports/smash/doc-kids/r2dliu/"
		>
			{"Doc Kid Article"}
		</Link>
	);

	const channelLink = (
		<Link className={styles.link} href="https://twitch.tv/r2dliu">
			{"twitch.tv/r2dliu"}
		</Link>
	);

	const descriptionEl = (
		<div className={styles.descriptionContainer}>
			<div className={styles.description}>
				<div className={styles.header}>EGtv. R2DLiu</div>
				<div className={styles.body}>
					<div>Gamertag: R2DLiu</div>
					<div>Sponsor: {egtvLink}</div>
					<div>Character: Fox</div>
					<div>Rank: 11th in Northern California, ~100-150 World</div>
					<div>Recent Tournaments: {ssbWikiLink} </div>
					<div>More Info: {docKidLink} </div>
					<div>Channel: {channelLink} </div>
				</div>
			</div>
		</div>
	);

	return (
		<div className={styles.Melee}>
			{image}
			{descriptionEl}
			<div className={styles.descriptionContainer}>
				<div className={styles.description}>
					<div className={styles.header}>Follow me on Twitch!</div>
					<Spacer size="sm" />
					<div className={styles.body}>
						<iframe
							title="twitch-embed"
							src="https://player.twitch.tv/?allowfullscreen&amp;playsinline&amp;player=twitch_everywhere&amp;targetOrigin=https%3A%2F%2Fembed.twitch.tv&amp;channel=r2dliu&amp;origin=https%3A%2F%2Fembed.twitch.tv"
							width="450"
							height="300"
							scrolling="no"
							allow="autoplay; fullscreen"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Melee;
