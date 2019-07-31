// @ts-nocheck

import React, { SyntheticEvent } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import ArticleCard from "components/ArticleCard";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import withNavigation from "components/helpers/withNavigation";
import NavigatingContextInterface from "components/helpers/NavigatingContextInterface";
import styles from "./Articles.module.scss";
import Link from "@material-ui/core/Link";

function Articles(props: NavigatingContextInterface & RouteComponentProps) {
	const redirect = (e: SyntheticEvent) => {
		const article = (e.currentTarget as HTMLElement).id;
		props.setIsNavigating(true);
		setTimeout(() => props.history.push(`/articles/${article}`), 300);
	};

	const GridLayout = WidthProvider(RGL);

	const layout = [
		{ i: "ledgedash", x: 0, y: 0, w: 24, h: 9, static: true },
		{ i: "nim", x: 0, y: 9, w: 22, h: 7, static: true }
	];
	return (
		<div className={styles.Articles}>
			<GridLayout
				className="layout"
				layout={layout}
				cols={24}
				rowHeight={25}
				width={400}
			>
				<div key="ledgedash" id="ledgedash" onClick={redirect}>
					<ArticleCard
						background={
							"https://s3.r2dliu.com/assets/articles/ledgedash/background.jpg"
						}
						previewBackground="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUFBQUFBQYGBgYICQgJCAwLCgoLDBINDg0ODRIbERQRERQRGxgdGBYYHRgrIh4eIisyKigqMjw2NjxMSExkZIYBBQUFBQUFBgYGBggJCAkIDAsKCgsMEg0ODQ4NEhsRFBERFBEbGB0YFhgdGCsiHh4iKzIqKCoyPDY2PExITGRkhv/CABEIADQAUAMBIgACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAAFBgEEAgMH/9oACAEBAAAAAOhgN818hd5nIjlTVjhboSf0X0Z2A8efHFkJ89exwwIPKOQFdUXmpSMnhY9PqYPsYQub1MEDaLm2jSI9p5FAZW//xAAbAQACAgMBAAAAAAAAAAAAAAAEBgIDAQUHCP/aAAgBAhAAAACLPorqVc3eE9C85kBs7Tz9ltlj/8QAGAEBAQEBAQAAAAAAAAAAAAAABQYEAwf/2gAIAQMQAAAA8pDX3LOi0cPKWRFMb2oh0sGz/8QAJBAAAwEBAAEFAAEFAAAAAAAAAgMEAQURAAYSExQHFSEiI0H/2gAIAQEAAQwAlsml2p2c2Lw7phLmlLJi1Ie1E+KQeqStxD8R+RYFrZ09GezCzU23869i50vEzWNqqMXR9O4QYeYeec9cCJLxMv8AvfPM/wBaAH597j2bc7OUCzlMfqAQIh01WLxmJx+fIqWbcyf6j0br4+cAnY5YIBfMeibZEgGVVzDUbNo0Wf1mTyIgDS9SdQsS1ckrm+mX9lk21IhHF+5OkUkH1m/VK13T2rP02+F/fAXwAI8BSOxBw/0B0GbhfyH7qh6jlS8/PIewqumPBUFMoqG2GGjwbYw+3kQKSzelkiRa8qQwzwTHLurM2tZHWrVFMhw/WxQnljJ9iXV0Q8F01pVjFpYnG8rjwe46iRfbKdHT/jbnN8/Qa1L4HGh4EqoH24xhLUce9BXSmzA9xptduJvwW9q5giaB0vRb/bfXP92U1frsTHWa+lZ2u7DNPZPzlbJNdMnVDYWbwZ4ubc+6h9JuDt79lBEnPh1ObnuZX1h5lbzeGjigzKezMfruh7XgeFY2NpdR7zidDsalzJGSqK+djF1CJA7QH4iW5nyz1hefROWvN0zEc6PTT+yQl2B9dfu7omJycuYl6yoeWPwunal9d36PkWeNFiaGoU/JzwOVJ+SXWlv+UXunqOWOn9XrfcvT3C3yvPR9/qN85r/Ho2tZvyNhFsbyN+h4HBCPObxOJ+NprLo3Md1OXUa063l82IE4zE5597Vtih5AJ+ODL1+jajwVGrH/xAApEAEAAQQCAQMDBQEBAAAAAAABAgADERIhMSITUWEEQXEFEEKR0RQj/9oACAEBAA0/ALvixYLEidgSXGam6Tt24RmyV7WXKHtXLrE1OfgrOdc4HPfBUUjN5cP2aR4iURz4rtzwLTQ+eTiJULa/l+xUnaRO5pKE3uJ7xozvrzEfzS4Ybd1EjiQccmeadi4y5wY4P7qVskXoYzNTJMT+yssLsPTZcw446x1XR0VjN0gymH5IFEsDIBX4Ljlr6iTCd3OETkBqMw2LYNwQc/NStFz/AKT+dxdZQ9xCnzjLvMBxnNQk3G66p5fYxVkIWbu5JnFNujrGabkZSnmQydDiQOEawEZwthr8nGBqbvOR4i+8n/ajPhFllPg5ClHWQJk6atznGNySZlBSI4qyyZ2WYY91xlKtxYlqBn/zzs98TKV6tRyZPbHJX06+rtIImXvQqEjezd9MXsIu7xVtYNqMvSYJ2amKk+b/AL8/tPBatsSJnHjzLGDjyasylKEwndmMvbrFEQbkbcBl85ls1PEmbLaUk6Dojn71vH0TPLHHky+c0ietbX7vOwY2rJsNvYGP5aleZzOGK528gOmh8ZRt5YZcuuy91CeJCPInZrmvz+/yhUElOMdpyliRLxDBlxjKvFFmVy5M8rmhwoVOPqRhfhKE5EnG3mC5w0iZeqZsPV/hJ9irkY5pjnprB0NfFe61q8Bg8Y1a/V/0q9sEVuT+p+m9SbPJzX1H6D9Pdvy0D1Zt2Xk+yfFSuXMEvIgEkIx2zxW03GPaogBbCPXz3X//xAAsEQACAQMCBAYABwAAAAAAAAABAgMABBEFEgYTISIUMTJBQlEjM1JhcYGR/9oACAECAQE/ANM8AzLNHBG22MkBV82/qra4WW0eQWoUr0CgVf2aW1rHMYZndQWYDy++prStesLM77m8hVCudiZJBNHiTTZL954BdXGc7QkRrSdQeDRZhAEWaKT1/IhvqoLyWTSp5JZJuafLr6jnrQ4ss5uHk0u1tJOYjd4YF3fPuMVw/Bp13YRDw8Cz/PcO7oa0zRo+UWLKMjHaKmuLZEjFqrA7cNuptdvSkUaBRsTH3n9+tRW+obkntyyn5OAQBSjUwqRLcSsgGcIojFcHz3NtqMcEd1MUdiZIywYfyaMUXPxy1/yrK3gCZEKZx+kVbfmSL7YBxV/6YR7GTBrhn8O6Yp2nc/l0+Vf/xAArEQACAQMDAwIFBQAAAAAAAAABAgMEBREAEiEGEzFBUQcVFyJxMkJygcH/2gAIAQMBAT8AuNx6vonnjrbhUFC+OX8gaa4V0r5lqJmJ+5tzHnVpD3OR0mkWJJnCq5Hk+w1V/DzqurqG+XWiftejthQw98nX046nkt0dJUG30QDLveacf5nVztEFTe43qi7xSJwn7VK6W30L9WQRVKxrQr5KEZxjgavvTVvhotlFVRgtIHiYkoIjnJ866mvfUNBUGJblXPTBAF7bHaOOfB1DUTzTJUzPMzBgVEjE+NVF+udVvWXYF9MaQOJd4XJLZIxjP5xqWuulWkcTyIQy/o2jjH50lI3fMkkLZONzNJ5/rV2p6ZYQzoBJwF08EOwntJn+I1MSrYU4HsNUEaCPeEUMc8451fGZaHIJB7g1HHHJDAzorHtryRn01//Z"
						title="Optimal Ledgedashing"
						description="Ledgedashing has become a staple in the modern era of Melee. It stands as the objectively best option from ledge for nearly every character in the game, but failure to execute often results in..."
						height={"400px"}
						width={"600px"}
					/>
				</div>
				<div key="nim">
					<Link href="https://s3.r2dliu.com/assets/articles/nim/nim.pdf">
						<ArticleCard
							background={
								"https://s3.r2dliu.com/assets/articles/nim/background.jpg"
							}
							previewBackground="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIACoAOgMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAAABAEDBQII/9oACAEBAAAAAPf0Z3FtehZwmlFrQ8ZyO7l6iOgGfKzD3QtTUyrp9ARIH//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIQAAAAAA//xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDEAAAAAAP/8QAKhAAAgIBBAEDAwQDAAAAAAAAAQIDBBEABRIhMRMiQRRRYRAgIzJCUoH/2gAIAQEAAT8A08iRqzuwVR2STgDVTdluwtJVpzMUd0YNhMMjEeWx0fIwNWju89BmzDUmEQfjGzSkMvuKhhwHxjOo7N2SKncptSsV5gkvMs8eYXXkGXAcZ0N1kVwwoSSQpyMs0REqKqjwoGGdvwAdVb9S36YhsJzdOYQni4X8qewe+8j9Ln1apGKawk8wGEpYDj9xx+dSU4YXO4W2eeaKJsZzxVf7HjGDxB66PbfnVCm70Nrv17jvOkRkLEgJOspLcZOIHQz7T5U6h3yezFRAoiB5pCuLMyw+1s8Cgwxct10NQbe88NiruYjkreo6xwL3E8L94kB7byRg9Y1NuNOtDP6R9YwK+Yq45sDGO1wvSkfnW11gsK3p/wCS3YX1GZkVWRX9yxdf4oDj8+f1sQz3rP08scsNaCRJC2VAnI7CYBJ4f7Z863qKSglr02svDuPGt6cWSYZJMqZUKjK5B93fnBGnqV3gjglhSRF44VwGA4eD38jUdVTuk9VpbH0kNWNjCWPos8jt4Oc5AXtfGo68ECGOCJI1JJKooVcsck4H31tE0MBsbS9h5pqZ8ydt6TnKZIAGcHH7N6kjiosxtLBiaD+U8cZEqniOXXYGNNelmaFaNf1kZmDTM3GJABnI+Xyevbr0Jtslm3ACW0LEkf1CKB/Hj284wT/VR2y5JI7Gp7kllBBtcsLysw5SE8kjQNhj15byFH31BBHXjEcY6HyeySeySfkn9ZYrr2XAsJHXCKBwXMhb5yWyABqTatuiq2mv85oiHkkaw7TMBnkccs4H2A1BPsNp4I4mqytMrOmIwchSQe8eQVI1HtW2wRRQ16UUSIoCqg4hQPAGNR7TLtKqNokXi1h5po58sGDkluJHat9vI/GqdtLDzRejLHJEF5h4yoy32bw3/D+0ADwP2//EABQRAQAAAAAAAAAAAAAAAAAAADD/2gAIAQIBAT8AT//EABQRAQAAAAAAAAAAAAAAAAAAADD/2gAIAQMBAT8AT//Z"
							title="On the Game of Nim"
							description="Nim is a simple but fascinating strategy and logic game. The game revolves around two players and piles of objects, known as..."
							height={"300px"}
							width={"400px"}
						/>
					</Link>
				</div>
			</GridLayout>
		</div>
	);
}

export default withNavigation(withRouter(Articles));
