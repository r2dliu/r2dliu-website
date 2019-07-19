import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
	return (
		<div className="container">
			<h1>Home Page</h1>
			<p>
				<Link to="/taniarascia">taniarascia</Link> on GitHub.
			</p>
		</div>
	);
}

export default HomePage;
