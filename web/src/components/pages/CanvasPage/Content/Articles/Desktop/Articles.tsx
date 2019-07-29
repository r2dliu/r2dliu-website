// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import GridLayout from "react-grid-layout";
import ArticleCard from "components/ArticleCard";
import withNavigation from "components/helpers/withNavigation";
import styles from "./Articles.module.scss";

function Articles() {
	const layout = [
		{ i: "ledgedash", x: 0, y: 0, w: 3, h: 2, static: true },
		{ i: "nim", x: 4, y: 0, w: 3, h: 4, static: true },
		{ i: "c", x: 4, y: 0, w: 1, h: 2 }
	];
	return (
		<GridLayout
			className="layout"
			layout={layout}
			cols={12}
			rowHeight={100}
			width={1200}
		>
			<div key="ledgedash">
				<ArticleCard
					articleId="ledgedash"
					background={"https://s3.r2dliu.com/assets/ledgedash.jpg"}
					previewBackground="data:image/jpeg;base64,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"
					title="Optimal Ledgedashing"
					description="This is a longish sentence that describes the best way to optimally ledgedash."
					height={"400px"}
					width={"600px"}
				/>
			</div>
			<div key="nim">b</div>
			<div key="c">asdfa;klfj;dkfjwerrek</div>
		</GridLayout>
	);

	// return (
	// 	<div className={styles.Articles}>

	// 	</div >
	// );
}

export default Articles;
