// import React, { useState, useEffect, Fragment } from "react";
import React from "react";
import Link from "@material-ui/core/Link";
import SvgIcon from "@material-ui/core/SvgIcon";
import Button from "@material-ui/core/Button";

import Spacer from "components/Spacer";
import Image from "../../../../../Image";
import styles from "./About.module.scss";

function About(): React.ReactElement {
	const age = Math.round(Math.abs(Date.now() - new Date("02/29/1996").getTime()) / (1000 * 60 * 60 * 24 * 365));
	return (
		<div className={styles.About}>
			<div className={styles.cardContainer}>
				<div className={styles.profileCard}>
					<div className={styles.main}>
						<div className={styles.pictureContainer}>
							<div className={styles.picture}>
								<Image
									src="https://s3.r2dliu.com/assets/profile.jpg"
									preview="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wEEEAALAAsACwALAAwACwAMAA4ADgAMABEAEgAQABIAEQAZABcAFQAVABcAGQAmABsAHQAbAB0AGwAmADoAJAAqACQAJAAqACQAOgAzAD4AMgAvADIAPgAzAFwASABAAEAASABcAGoAWQBUAFkAagCBAHMAcwCBAKIAmgCiANMA0wEcEQALAAsACwALAAwACwAMAA4ADgAMABEAEgAQABIAEQAZABcAFQAVABcAGQAmABsAHQAbAB0AGwAmADoAJAAqACQAJAAqACQAOgAzAD4AMgAvADIAPgAzAFwASABAAEAASABcAGoAWQBUAFkAagCBAHMAcwCBAKIAmgCiANMA0wEc/8IAEQgAeQBbAwEiAAIRAQMRAf/EABsAAAIDAQEBAAAAAAAAAAAAAAQFAgMGAAcB/9oACAEBAAAAAMZ0ajhhJklAUXztrsYZlgUxzO0ztMaIuF5dPDztqlMsIVvwINbaok+E1ydvSJeXZ9cyvV5mRC4xkpN3w6LgUtdrN/hn+uarYi5BaeV6z5N25KrpXK8npXTTCL99PiqT/MyN+BjBXrS8wgfz+G7Dy9l+wG4AjFstKuz7JY1G6sC0btnl3aaUxrKChhN4qc5YElkuHEZA+q4l5mU19nQjMf8A/8QAGQEAAgMBAAAAAAAAAAAAAAAAAgMAAQQF/9oACAECEAAAAGA2OrLZ3KzG5QEApc1YDkt6uunljpDrVhszfFCQf//EABcBAAMBAAAAAAAAAAAAAAAAAAECAwD/2gAIAQMQAAAAJnk1wmpqyS7IHoYNN60hKLXCiOfEIc6n/8QAKRAAAwABBAIBAwQDAQAAAAAAAQIDBAAFERITISIUIzIGMUFCJTRRNf/aAAgBAQABDACZCWVzQkojOD1AOivTsgXkGZB/LkSeNQkq+hmyATt5ezFfK3kIPCWKdUT5vDDqfL90maYDtn0TGoyV3P6mucuI7yZ0xQ6hhqgUNzLsRB3YluunoCv/ADRcIQHQaEkULzMFr4U3oiAnxs/UlU96x28c/LSDuzS7+DIZjzjVw51ysi9exxUGVuBatCmhhqVX/IJLVYY3SxSro2NCjfFb9Q3eYdaaFgAAeToWX4BmLILSycaEIsoq+KkN1x4lkYK/CmgK6ly7+SLGWtxZWelmZgceYTDe5ZRqm4Y93NLyBqxp2RiPS0IqP6BJ3dHJTlZSnH7jxU6EWyYJ5MNiM3BxFFXhbgvkI5x8jufK2QklkI0Whe8kth3KrVtzta93Ne3IVCFUgEGMQfyU6NVZH5s76RVD/D56NbRZuAeDmYz4br6Ixq1o5jjMJawNth4JXshd9629Y0akZ9FnTgoC3GptWzqO/AzORjoeedYZ7mo6rriH8h9BZqvXv21XGbhAsR5Dj1TxUQhVxMXGuSMjxsJY+3OzmLCM8s42OuKkVYNlM79H7I5tjibqwYELVU4JQEZTu2Ig4BSHp/8Ag6WHpTwKqYzna6l0fNyWXoKlU2jKeWUrOzMlq83M0JdLyxv3RXC5EqABrll1IXSg9ULbioplu0wSuTBl4IbsqMzqU7cJjyBWj9SdSwUpNX7Pr9TwhLDR4q/CK1aKi8c4EBKbhwDrZXFHKvRtOrykSDIVyMH4Q7hLWb6igCcTSt8BRhQg4bywPS5SiA6d+K0PGoECKMp7Oajn13IyZTyJUhdA89223H27OX6e4tGffIpNZVLHC25MJiEZnpZn6MG9qXN5/kQelfqEs1GY573OQGqyxgUfnyCZVcpSt6qw97RhJTEnc/u+wAsSqz43u1L8Q7lZZKIhIT0JZF8DJS8G4OLmVz4DIi3UpflnHVuYWdvL5CTqVg4LeNuMnDxMtESofhfCT6CHW+TnLdMlJoEXZd0OI641PcT9byfEZhNwuXDMQAbn7unTsGUj1sRyrY1JRC81x91FBxQE2TIldKTHRIZOItpefyDWZm4JIM+CPrJ+J1x5923p2fcruyhTs+ML5y8p3DXoxJZWJzW5BHOq8+RRrxfENrZMlMPeFWrFY5naTEUZGST47sA9mVeMf6fINLurJl4j47g5JeiZEIpULWTa3Cnmya14AH6cvOORkF9Luswqjw86yu3vnTsDkJxrqRjE/wA5y8Um49apauTgwyHqGejqYeRa9aNVm24Bn9LgFMY3o6gvlO4bv8jaPeKkAqcezQoXQ8Fqkkk+9boqrz25UWVRVDMHrObNikgEnIBMJA/ltrwM3WrFSQ2XXgsA9MW8WZGXWNjNdxI16aOMATy/OsfJx2txk8meVh1gqV68R963CVC+O9pUU3xqNz0nyEvCeGWeTgZVJXrmlFK629Z0dlpUTVR95hP5gRZuga6ayk8bkFtLNqK/RwCyOAfWsWz1eE8y7GNgnlfxc+P9S/6WDqX4Zeqf6R1l/wDo5Wsf++m/jSfuuq/k2l/PR/bX9k0df//EADEQAAICAQQBAwMCAwkAAAAAAAECABEhAxIxQVETInEQYYEyQpGxwRRSYnKhorLC0f/aAAgBAQANPwC7s0Qf44M2E+KEYgbrypnFiAbdTUJxk2LuBsEcFef4iGwp4JYdwmwC2B4FeYWCagRtudTC3fIi6doCwUhloEZuaZr2GkLkWx+fMIigEkxsmYs/3YLIoVmPW037ST5MoDYh3AEC6uLqEoeDNxf1AcFur+Jq6oVwTyAYzuc1eD0JqOxLDkFoFClC1FSoqCiune4MPn7TazMa4A7MNU3RPIgJFGKPmu8CamoS1vtomAqT6dkeaE2sSjE87uBKFhmvcQQSBClIrKQRmqHwIWNXjjAqH9RUYNYhAJ8tGBUD58xEOW+ehNg5O4HcORCVCuqVXR+bmmFtW/c3e24rU47xncPmax9Rmq2Xb5BmmLYftYjqOd21v2yup9zRhPwTAezV57gbJXsDoz1t/RY/IM1WZ3Zvd6IXwBH1WVTqAsrKCBYCwGnXwR3AfwYm5lIoVN+WAxxiptsbjPtxGQ9gZ5hr3A2KA5gwPJMW1RSpu153FeDiMWQqVIZwO8/ziODhv1M3Z8jzPUG+wSoUYJP2hBJHYnzXMsG+wfBlZMH3jBgARt3VOlE7smlEYbsLsHGdp8m5oKuwgb2Y14OSRA97KrZVZowaxVmXAIH6h+ZgWcjA84gwf8MBupwteYR4nr0wINJa9XGMbggzQFov2YVCGp6O0Fu6PmIwBZ1y2RHV3cAZ1VAr8HwYwbUwKZV8GIf5GFjiNdrWFvxP89RxTKZ/uQ+DGIUeRcI2s7/0rqDgxecQKEFLVC7JM08pqgi3HcJO0kC3zU3m4GZQfzU/JgFuAaLHwZ2vRitj/wAM4ZD9uaMe/aftyaiAbVvba8ChP9YmpvFSgqhjeFgI9o4Fiaj/AJVjOsmMOuPpWJpOLG4ggN3Fs0SSY2wst2BXzCzAjqxG6swDD9E9/MO2wPiIC9XtBKzzRP03y5qkK8IYgepmoXZBRAIPKkxKO+9wN5BBhApCKokeYuUIG3awHg4IjG8R9HYPMoZ2AwfQGPp2IuAN2T1kTcS2mq0AoqrMbUNDirIBv+EU36R5ZRD2T44hAx1QlES4YGGT5+mlqvpmI25WjsTOiMiUxBMBPGbAlMfM1T7Mgmuga+mrpK6sDijFO7e7c7c0BFNGlJzDs1VDc2uGhv3GBsG6xB+lZ5EANiVFUlUbjHEv23zUr/qJ6H9Z/aVnpan/ABl/W/pRlL9P/8QAIxEAAgEDBAIDAQAAAAAAAAAAAQIAAxEhBBIxQRAiE1FhYv/aAAgBAgEBPwA/XhVvFwYqgsIEDlmJ7gc8kXg9oAbXgYC8DgqZvI4MLjiUj7YI4m9FwWBNoGvDcEDrxSsy7iMyrbLCK8V7WMJBbjELG+DNLQcJuZsHqakOgxxB8hHEWpn2mnq73I/JqGqI+Da8AsABwJXF6TRav8zLZ2Ej8mnJLn0IFuTNQahqWFLcAPudeLWdgcBTe8YEKGVwFvc46jHau4An8EQq43LB4Zfa9+uIBnwKYViQSARx1P/EACIRAAICAQQDAAMAAAAAAAAAAAABAhEhAxIxURAiQRNSwf/aAAgBAwEBPwBGByaaHkcntl9ZbhSp3XwcWlh8mUiUrdCTkfjaeB6dU8MbulSVGqu7dEIOc1UWuycNrTixtbJL6QyuDVtTo0+mJ5oaXZNJSvhEMI1tRbqS4+mk4yu+T07E40jWyrsUsHJB1IuP7G+r9kSaa5Eo1mdef6Jcpoiuxpofhcom8C4RubP/2Q=="
								/>
							</div>
							<div className={styles.social}>
								<Link
									href="https://www.facebook.com/david.liu.1213986"
									target="_blank"
									rel="noopener"
								>
									<SvgIcon
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
										className={styles.icon}
									>
										<path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
									</SvgIcon>
								</Link>
								<Link
									href="https://linkedin.com/in/r2dliu"
									target="_blank"
									rel="noopener"
								>
									<SvgIcon
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
										className={styles.icon}
									>
										<path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
									</SvgIcon>
								</Link>
								<Link
									href="https://twitter.com/R2_DLiu"
									target="_blank"
									rel="noopener"
								>
									<SvgIcon
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
										className={styles.icon}
									>
										<path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z" />
									</SvgIcon>
								</Link>
								<Link
									href="https://twitch.tv/r2dliu"
									target="_blank"
									rel="noopener"
								>
									<SvgIcon
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
										className={styles.icon}
									>
										<path d="M40.1 32L10 108.9v314.3h107V480h60.2l56.8-56.8h87l117-117V32H40.1zm357.8 254.1L331 353H224l-56.8 56.8V353H76.9V72.1h321v214zM331 149v116.9h-40.1V149H331zm-107 0v116.9h-40.1V149H224z" />
									</SvgIcon>
								</Link>
							</div>
							<div className={styles.resume}>
								<Button
									onClick={() =>
										(window.location.href =
											"https://s3.r2dliu.com/assets/resume.pdf")
									}
									className={styles.button}
								>
									<b>Resume</b>
								</Button>
							</div>
						</div>
						<div className={styles.descriptionContainer}>
							<div className={styles.description}>
								<div className={styles.header}>About Me</div>
								<div className={styles.body}>
									<div>
										Name: David / Zhiyuan Liu / 刘致远
									</div>
									<div>Age: {age}</div>
									<div>DOB: February 29th, 1996</div>
									<div>Email: zliu3301@gmail.com</div>
									<div>Phone: (302) 824-5107</div>
									<div>Position: Full Stack Software Engineer</div>
									<div>Skilled in: C++, Javascript, Rust, Python</div>
									<div>
										Hobbies: Melee, Bouldering, Tennis,
										Programming
									</div>
								</div>
							</div>
							<div className={styles.work}>
								<div className={styles.header}>Recent Work</div>
								<div className={styles.body}>
									<Link
										className={styles.link}
										href="https://www.jhuapl.edu/"
										target="_blank"
										rel="noopener"
									>
										{
											"JHU Applied Physics Laboratory: August 2019 - Present"
										}
									</Link>
									<div>
										APL, the nation's largest university
										affliciated research center, solves
										complex research, engineering, and
										analytical problems that present
										critical challenges to our nation.
									</div>
									<div>
										Role: Full stack software architect.
										Machine learning, data fusion, autonomous systems
									</div>
									<Spacer size="md" />
									<Link
										className={styles.link}
										href="https://smash.gg"
										target="_blank"
										rel="noopener"
									>
										{"smash.gg: May 2018 - July 2019"}
									</Link>
									<div>
										A powerful platform designed to empower
										esports communities through competitive
										structure and enabling easy, intuitive
										event organization.
									</div>
									<div>
										Role: Full stack software engineer.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;
