import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";

import Image from "components/Image";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import GridLayout from "react-grid-layout";
import ArticleCard from "components/ArticleCard";
import DescriptionCard from "components/DescriptionCard";
import styles from "./Articles.module.scss";

const EMBED_URL = "https://embed.twitch.tv/embed/v1.js";

function Melee() {

	const layout = [
		{ i: "ledgedash", x: 0, y: 0, w: 4, h: 3, static: true },
		{ i: "nim", x: 4, y: 0, w: 3, h: 4, static: true },
		{ i: "c", x: 4, y: 0, w: 1, h: 2 }
	];
	return (
		<GridLayout className="layout" layout={layout} cols={12} rowHeight={100} width={1200}>
			<div key="ledgedash"><ArticleCard /></div>
			<div key="nim">b</div>
			<div key="c">csdlkjf;klfj;dkfjwerrek</div>
		</GridLayout>
	);

	// return (
	// 	<div className={styles.Articles}>

	// 	</div >
	// );
}

export default Melee;
