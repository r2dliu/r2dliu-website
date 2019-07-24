import React from "react";
import styles from "./Spacer.module.scss";

interface Props {
	size: "xs" | "sm" | "md" | "lg" | "xl";
}

function Spacer(props: Props) {
	const currSize = props.size;

	const getSizeClassName = (size: string | null) => {
		switch (size) {
			case "xs":
				return styles.xs;
			case "sm":
				return styles.sm;
			case "md":
				return styles.md;
			case "lg":
				return styles.lg;
			case "xl":
				return styles.xl;
			default:
				return styles.md;
		}
	};

	return <div className={getSizeClassName(currSize)} />;
}

Spacer.defaultProps = {
	size: "md",
};

export default Spacer;
