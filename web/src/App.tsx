import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomePage from "./components/HomePage";
import CanvasPage from "./components/CanvasPage";
import { setDefaultBreakpoints, BreakpointProvider } from "react-socks";

import styles from "./App.module.scss";

function App() {
	setDefaultBreakpoints([
		{ xs: 0 },
		{ s: 600 },
		{ m: 900 },
		{ l: 1200 },
		{ xl: 1500 },
	]);

	return (
		<BreakpointProvider>
			<div className={styles.App}>
				<BrowserRouter>
					<Switch>
						<Route exact={true} path="/" component={HomePage} />
						<Route path="/:id" component={CanvasPage} />
					</Switch>
				</BrowserRouter>
			</div>
		</BreakpointProvider>

	);
}

export default App;
