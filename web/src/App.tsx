import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { setDefaultBreakpoints, BreakpointProvider } from "react-socks";

import NavigationProvider from "./components/helpers/NavigatingProvider";
import HomePage from "./components/pages/HomePage";
import CanvasPage from "./components/pages/CanvasPage";
import ArticlePage from "./components/pages/ArticlePage";

import styles from "./App.module.scss";

function App() {
	setDefaultBreakpoints([
		{ xs: 0 },
		{ s: 600 },
		{ m: 900 },
		{ l: 1200 },
		{ xl: 1500 }
	]);

	return (
		<BreakpointProvider>
			<NavigationProvider>
				<div className={styles.App}>
					<BrowserRouter>
						<Switch>
							<Route exact={true} path="/" component={HomePage} />
							<Route
								path="/articles/:id"
								component={ArticlePage}
							/>
							<Route path="/:id" component={CanvasPage} />
						</Switch>
					</BrowserRouter>
				</div>
			</NavigationProvider>
		</BreakpointProvider>
	);
}

export default App;
