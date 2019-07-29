import React, { ComponentType } from "react";

import NavigatingContext from "./NavigatingContext";
import NavigationProps from "./NavigatingContextInterface";

export default function withNavigation<Props extends NavigationProps>(
	Component: ComponentType<Props>
) {
	return function NavigationComponent(
		props: Pick<Props, Exclude<keyof Props, keyof NavigationProps>>
	) {
		return (
			<NavigatingContext.Consumer>
				{contexts => <Component {...props as Props} {...contexts} />}
			</NavigatingContext.Consumer>
		);
	};
}
