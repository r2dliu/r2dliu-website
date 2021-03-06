// @ts-nocheck

import RGL, { WidthProvider } from "react-grid-layout";
import ProjectCard from "components/ProjectCard";
import { withRouter } from "react-router";
import withNavigation from "components/helpers/withNavigation";
import styles from "./Projects.module.scss";
import Link from "@material-ui/core/Link";

function Projects() {
	const GridLayout = WidthProvider(RGL);

	const layout = [
		{ i: "slippi", x: 0, y: 0, w: 12, h: 3, static: true },
		{ i: "hangman", x: 12, y: 0, w: 12, h: 3, static: true },
		{ i: "website", x: 0, y: 3, w: 12, h: 3, static: true },
		{ i: "scoreboard", x: 12, y: 3, w: 12, h: 3, static: true },
		{ i: "tableone", x: 0, y: 6, w: 12, h: 3, static: true }
	];
	return (
		<div className={styles.Projects}>
			<GridLayout
				className="layout"
				layout={layout}
				cols={24}
				rowHeight={50}
				width={1200}
			>
				<div key="slippi">
					<Link href="https://slippi.gg/about">
						<ProjectCard
							background={
								"https://s3.r2dliu.com/assets/projects/slippi.jpg"
							}
							previewBackground="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUFBQUFBQYGBgYICQgJCAwLCgoLDBINDg0ODRIbERQRERQRGxgdGBYYHRgrIh4eIisyKigqMjw2NjxMSExkZIYBBQUFBQUFBgYGBggJCAkIDAsKCgsMEg0ODQ4NEhsRFBERFBEbGB0YFhgdGCsiHh4iKzIqKCoyPDY2PExITGRkhv/CABEIABEALAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAAABAEDBgX/2gAIAQEAAAAAV6iMrUs7XMSokAB//8QAFgEBAQEAAAAAAAAAAAAAAAAAAAIF/9oACAECEAAAAMNI/8QAGAEAAgMAAAAAAAAAAAAAAAAAAAIDBAf/2gAIAQMQAAAAwuOqgf/EACkQAAICAQMCAwkAAAAAAAAAAAECAxEEAAUhEkEGIjEQExQjMFFhgYL/2gAIAQEAAT8AxcaTMyI4I6DOas8AdyT+BqPZDLlSYsedimVLsWwHHYEitDbNxZUdcOcq10QhINGtLte5OGrDnPSAT5DYB1NBNjsEmidGIumBBr9+zFyXxZRIqo3BBRxasD6gjWZ4w23I2tMaLw5tqT1TSe4TSbvMnU3R8xr6nEkik2b9FIGl3iRHLrEQTXImlvj+tZmZ8YQ7R0/dy7uSPt5ifof/xAAbEQACAQUAAAAAAAAAAAAAAAAAAQIREiAiUf/aAAgBAgEBPwCKhR3M06PD/8QAIBEAAgIBAwUAAAAAAAAAAAAAAQIDEQQAICEiQVFh8P/aAAgBAwEBPwDETBeNzPKFZeaIPUPArQTC4uRvf1akCByEa17HZ//Z"
							title="Project Slippi"
							description="A 'Melee Data FrameWork', an open source project. Contributed mostly work on Dolphin, the open source Wii/Gamecube emulator written in C++, to add infrastructure and improve the playback system for Slippi replays."
							height={"170px"}
							width={"436px"}
						/>
					</Link>
				</div>
				<div key="website">
					<Link href="https://github.com/r2dliu/r2dliu-website">
						<ProjectCard
							background={
								"https://s3.r2dliu.com/assets/projects/website.jpg"
							}
							previewBackground="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMDAwMDAwMEBAMFBQQFBQcGBgYGBwoHCAcIBwoPCgsKCgsKDw4QDQwNEA4YExERExgcGBYYHCIeHiIrKSs4OEv/wgALCAAYADEBAREA/8QAGQABAAMBAQAAAAAAAAAAAAAAAQAEBgII/9oACAEBAAAAAPB8sdVEXSuXRlorSf/EACUQAAIBAwQCAQUAAAAAAAAAAAECBAADEQUQEiEGgTITMUFRYf/aAAgBAQABPwCu6j2RcuMrD8VJsra+mAc5H3/dYO3rZSBnr3XjszS4k248/TEmJwCoruyBWY/PKkV5LJ0qRdsiDptuMUL8zbdnVgfiByJ6Xf3vHuqpwxx/akXA3EBgcDsis7//2Q=="
							title="Website"
							description="Progressive web app style website, created with React and Flask, hosted on AWS"
							height={"170px"}
							width={"436px"}
						/>
					</Link>
				</div>
				<div key="hangman">
					<Link href="https://github.com/r2dliu/hangman">
						<ProjectCard
							background={
								"https://s3.r2dliu.com/assets/projects/hangman.jpg"
							}
							previewBackground="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAAaAD4BAREA/8QAGwABAAEFAQAAAAAAAAAAAAAAAAgCAwQHCQb/xAA4EAABAwQAAwMEEwAAAAAAAAACAQMEAAUGBwgREhMhQQkUJCYVFiMxMjhGUVJWV2RxdpKWt9HU/9oACAEBAAA/AJEUqA+Ia0w7avEzxcBsCBcciaxa+aZg47GdybKrfEs0S5argXC4MQYdovVvisjMm+lSFRlScfVXCLmq89L8X7vDtwr3vSd1uWp89zhnO71l2LMa/wBeZPmN0yfIbmtstL9slsWqTmUd6VHtK+dkRRlM0flNNdC9qhBPHCNE6jxudY8zxvC59ivbUVqdCW4ZFl8iZbiuEJRdjTbdcshnwUlNMyXI0ll5l8WXkNAXrATTd9KUpUQtHfGa41/zPov+IIFRq3nrANm+U/4XZUzM5FhXVOlch2pYLMxCC4t32bac5WzXu2SOubG9hxn268xHBuIMzDeG3EwjHuaGPVKlKUqnrD6Q/qT+6iHo4hTia41uZCnrPovxT7IIFSCXWuvy2KG2yxm1FshvGiw5vMFR1bs3i5yvPjsoGr3YBCKX6QQiyhk53qa+9XuuoV7kIVX8UqqlKxLgInb54kKEJQpYkJIiiQrHcRRJF5oqKi8lRe5U7lrjeeA4L1n6lYl8Ivk5Z/nX7nVgNa66Yceks4DhTMmaoFMkNYrYm35ZMD2LBSXQgI4+TLKI00rpGrbaIAchTlV32g4J9SsS/bln/wAdbH1DheHQdnYRMhYnjUOXHyCC7HlRbFa48hh0TXpcZfZig604PgYEJJ4LXValK//Z"
							title="Hangman Game"
							description="Multithreaded, multiplayer hangman game, coded entirely in C++. Handcoded HTTP server that serves dynamically generated HTML/CSS to a browser."
							height={"170px"}
							width={"436px"}
						/>
					</Link>
				</div>
				<div key="scoreboard">
					<Link href="https://github.com/r2dliu/scoreboard">
						<ProjectCard
							background={
								"https://s3.r2dliu.com/assets/projects/scoreboard.jpg"
							}
							previewBackground="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMDAwMDAwMEBAMFBQQFBQcGBgYGBwoHCAcIBwoPCgsKCgsKDw4QDQwNEA4YExERExgcGBYYHCIeHiIrKSs4OEsBAwMDAwMDAwQEAwUFBAUFBwYGBgYHCgcIBwgHCg8KCwoKCwoPDhANDA0QDhgTERETGBwYFhgcIh4eIispKzg4S//CABEIABQAMAMBIgACEQEDEQH/xAAbAAACAQUAAAAAAAAAAAAAAAAHCAYAAgMFCf/aAAgBAQAAAABNDW2WdY1t2bovzYlnPyQTIyUDRd//xAAWAQEBAQAAAAAAAAAAAAAAAAAGBQT/2gAIAQIQAAAATQrOomi//8QAFgEBAQEAAAAAAAAAAAAAAAAABQQG/9oACAEDEAAAABVzo9AT/8QALhAAAQMCBgADBwUAAAAAAAAAAQIDBAUGAAcIERIhExQVGCIxMlWU1CNEUWG0/9oACAEBAAE/AIDcm37cvWooYacU1Aj8EvtofaJMxn5kK3ChjTNlvR9RSL1buF92lmiGCuMqhRIkQq814vMO/pK3HuYGiDKZbQcN93kS0ewH4HJCh/Xl8DRjlcUMFWYt7tpUQEF6RAQCVHYJBMf5sal8mba09W3blYt2p1KqyanVXYrwrzcWayEtteLyaSGk4jTZFy2TAlvRorTnrc1BTGYRHb2DDHfBsAb4Q6zKtS82Dxd5w4o4JV2d5rI62xoViMUyZmwGKK7BDrNH2QVl34B/vvEKA+hqoPIS2DIdKingAVK4hO6uu+kgYeprs1MOM4llJaUh/tsFAU0rdJT0diD2Ma7vIOWdlsifGL0du4pAcSFlrmBGxS3Y0Sxo6IrZQ367N90kn9ux/OEumn2vdcxhCEvsx4bqCUgjdE1lQBB+IxlBn/eGWSLlXRqVR1iWIaFoksvLCdua+ih1Bx7bOa30G2PtpX5GPbazW+g2x9tK/IxnxqAvXNq3qDCrMKlxWoFQcfaMBp5pRLrJQQouOuYoG71gtFZ3Irsz/Mxj/8QAJxEAAQMCAgsBAAAAAAAAAAAAAQIDBAARBRIGEBMUITEyMzRBkrH/2gAIAQIBAT8Ax5htuYXmnwnKgWFzmoS5Y5SXPo1g0XazGJTroN7jjcqrSdKd+6R2xqwTyIw9XV+V/8QAJREAAQQAAgsAAAAAAAAAAAAAAQACAwUREgYQExU0QlJigpGx/9oACAEDAQE/AKF80ledoOcrJH0hXEr2107WduHtaMvfuojMcDNqueBn8fq//9k="
							title="Scoreboard"
							description="Scoreboard app for updating overlays. Created with Python/PyQT, overlays rendered with HTML/CSS/Javascript"
							height={"170px"}
							width={"436px"}
						/>
					</Link>
				</div>
				<div key="tableone">
					<Link href="https://github.com/r2dliu/tableonegraphs">
						<ProjectCard
							background={
								"https://s3.r2dliu.com/assets/projects/r.jpg"
							}
							previewBackground="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMDAwMDAwMEBAMFBQQFBQcGBgYGBwoHCAcIBwoPCgsKCgsKDw4QDQwNEA4YExERExgcGBYYHCIeHiIrKSs4OEsBAwMDAwMDAwQEAwUFBAUFBwYGBgYHCgcIBwgHCg8KCwoKCwoPDhANDA0QDhgTERETGBwYFhgcIh4eIispKzg4S//CABEIABQAMAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAABAYHCAkDBf/aAAgBAQAAAADVPhCTKs6sENU6p6oesDdjOZlH/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAUGAf/aAAgBAhAAAAAq5XGi7//EABcBAAMBAAAAAAAAAAAAAAAAAAAFBgH/2gAIAQMQAAAAJyi1Uy//xAAoEAACAgIBAgUEAwAAAAAAAAABAgMFBBEGABIHFCExYRATIkEgM2L/2gAIAQEAAT8A6sc+CrwMrMn2I4ULNr3+APk9WvLb2aqsr3KuBT0OH/bOiu/b+QXQEYLudnqt8baHHzoIsDxMxrOWV1TyudjZGMJCfZRM66Rj+u466qrTGuazBzsfuEUyd3Yw0yneirf6UjR+vJKlrqlsMJZRG0sX4E+wdT3Lv42OvEfkL1XhJy7i9tgzYlikQ8uWQ9kwadW9G6TImvsXw647ZY1TX17yBoLDFhVsufvcp9vIkDejknX5aC+hPXGqtqWkwsN5AzIHdyvsZJXMja+AW/hzfidTzLjdjR2JmGJlqqyNCwWQBWD7ViDo7HVz4GcHu+E8d4tk+eGFUOXxZ45VXJBbYbb9vqG31UY3kK/ExvMTTmCFIvuzsGkfsGu5yANsf2fp/8QAIBEAAgEDBAMAAAAAAAAAAAAAAQMCAAQRBRASITEycf/aAAgBAgEBPwCtH0Wzv7Jj3TnEhsoDiQOow5ZwQSaOMnHjazc5a0iDZxAfkYJHfGme8/tf/8QAIhEAAgECBQUAAAAAAAAAAAAAAQIDAAQFEBEhMSMzQWFy/9oACAEDAQE/AKxTFbqzu0iiRCpRW3B5Lac+KG4GV7HG8spaNT0dNx7qLtp8iv/Z"
							title="Table One"
							description='App developed in Shiny, a web application framework for R. Produces a configurable "Table 1," a description of baseline patient characteristics'
							height={"170px"}
							width={"436px"}
						/>
					</Link>
				</div>
			</GridLayout>
		</div>
	);
}

export default withNavigation(withRouter(Projects));
