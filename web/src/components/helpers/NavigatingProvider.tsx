import React from "react";
import NavigatingContext from "./NavigatingContext";

class NavigatingProvider extends React.Component {
	state = {
		isNavigating: false
	};

	setIsNavigating = (isNavigating: boolean) => {
		this.setState({ isNavigating });
	};

	render() {
		const { children } = this.props;
		return (
			<NavigatingContext.Provider
				value={{
					...this.state,
					setIsNavigating: this.setIsNavigating
				}}
			>
				{children}
			</NavigatingContext.Provider>
		);
	}
}

export default NavigatingProvider;
