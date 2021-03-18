import React, { useState } from "react";
import { omit } from "lodash";
import cn from "classnames";
import styles from "./Image.module.scss";

interface Props {
	src: string;
	width: string;
	height?: string;
	preview?: string;
}

const defaultProps = {
	height: null,
	width: null,
};

function Image(props: Props): React.ReactElement<Props> {
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
			{preview && <img
				{...filteredProps}
				className={cn(styles.preview, {
					[styles.loaded]: isLoaded,
				})}
				src={preview}
				alt="preview"
			/>}
		</div>
	);
}

Image.defaultProps = defaultProps;

export default Image;
