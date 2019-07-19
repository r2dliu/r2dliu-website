import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import HomePage from "./components/HomePage";

const styles = require("./App.css");

function App() {
	return (
		<div className={styles.App}>
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={HomePage} />
					{/* <Route path="/:id" component={UserPage} /> */}
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
