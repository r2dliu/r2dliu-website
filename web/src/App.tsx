import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomePage from "./components/HomePage";

import styles from "./App.module.scss";

function App() {
	return (
		<div className={styles.App}>
			<BrowserRouter>
				<Switch>
					<Route exact={true} path="/" component={HomePage} />
					{/* <Route path="/:id" component={UserPage} /> */}
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
