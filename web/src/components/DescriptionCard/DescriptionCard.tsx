import React from "react";
import cn from "classnames";
import styles from "./DescriptionCard.module.scss";

interface Props {
	reverse?: boolean;
	left: React.ReactNode;
	right: React.ReactNode;
}

const defaultProps = { reverse: false };

function DescriptionCard(props: Props) {
	const {
		reverse,
		left,
		right,
	} = props;

	return (
		<div className={styles.DescriptionCard} >
			<div className={cn(styles.left, { [styles.reverse]: reverse })} >
				{left}
			</div>
			<div className={cn(styles.right, { [styles.reverse]: reverse })} >
				{right}
			</div>
		</div >
	);
}

DescriptionCard.defaultProps = defaultProps;

export default DescriptionCard;
