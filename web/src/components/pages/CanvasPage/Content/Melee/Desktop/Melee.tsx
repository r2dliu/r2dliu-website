// import React, { useState, useEffect, Fragment } from "react";
import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";

import Image from "components/Image";
import DescriptionCard from "components/DescriptionCard";
import styles from "./Melee.module.scss";
import Spacer from "components/Spacer";

const EMBED_URL = "https://embed.twitch.tv/embed/v1.js";

function Melee() {
	const [hasTwitchEl, setHasTwitchEl] = useState(false);
	useEffect(() => {
		if (!hasTwitchEl) {
			let embed;
			const script = document.createElement("script");
			script.setAttribute("src", EMBED_URL);
			script.addEventListener("load", () => {
				// @ts-ignore-line
				embed = new window.Twitch.Embed("twitch-embed", {
					channel: "R2DLiu",
					height: 480,
					width: 854
				});
			});
			document.body.appendChild(script);
			setHasTwitchEl(true);
			return embed;
		}
	}, [hasTwitchEl]);

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
			<div className={styles.cardContainer}>
				<DescriptionCard left={image} right={descriptionEl} />
			</div>
			<div className={styles.descriptionContainer}>
				<div className={styles.description}>
					<div className={styles.header}>Follow me on Twitch!</div>
					<Spacer size="sm" />
					<div id="twitch-embed" />
				</div>
			</div>
		</div>
	);
}

export default Melee;
