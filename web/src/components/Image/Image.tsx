import React, { useState, useEffect } from "react";
import { omit } from "lodash";
import cn from "classnames";
import styles from "./Image.module.scss";

interface Props {
	src: string;
	preview: string;
}

export default function Image(props: Props) {
	const [isLoaded, setIsLoaded] = useState(false);
	const {
		preview,
		src,
	} = props;

	const onLoad = () => {
		setIsLoaded(true);
	};
	const filteredProps = omit(props, "preview");

	return (
		<div className={styles.Image}>
			<img
				{...filteredProps}
				className={styles.highRes}
				onLoad={onLoad}
				src={src}
				alt="main"
			/>
			<img
				{...filteredProps}
				className={cn(styles.preview, {
					[styles.loaded]: isLoaded,
				})}
				src={preview}
				alt="preview"
			/>
		</div>
	);
}