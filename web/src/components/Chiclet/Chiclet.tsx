import React from "react";
import cn from "classnames";
import styles from "./Chiclet.module.scss";

interface Props {
	color: string;
	text: string;
}

function Chiclet(props: Props) {
	const { color, text } = props;

	function getColorClass(color: string) {
		switch (color) {
			case "red":
				return styles.red;
			case "green":
				return styles.green;
			case "blue":
				return styles.blue;
		}
	}

	const colorClass = getColorClass(color);
	return (
		<span className={styles.Chiclet}>
			<div className={cn(colorClass, styles.text)}>{text}</div>
		</span>
	);
}

export default Chiclet;
