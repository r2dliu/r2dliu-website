import React, { Fragment } from "react";
import Breakpoint from "react-socks";
import cn from "classnames";
import Link from "@material-ui/core/Link";
import Image from "components/Image";
import styles from "./Ledgedash.module.scss";

function Ledgedash() {
	const articleBody = (
		<Fragment>
			<p>April 16th, 2018, by David "R2DLiu" Liu</p>

			<h1 id="introduction">{"Introduction"}</h1>
			<p>
				Ledgedashing has become a staple in the modern era of Melee. It
				stands as the objectively best option from ledge for nearly
				every character in the game, but failure to execute often
				results in huge punishes or even a self-destruct. As a result,
				even the best players in the world often resort to low effort
				but less risky options from ledge (SFAT ledgedash, Mang0 double
				laser). Some players, however, seem to be incredibly consistent
				and accurate with their ledgedashing (Leffen, Plup). This
				article will explain why ledgedashing seems to be so
				inconsistent for some players and less so for others. It will
				explain the best methods for ledgedashing from a human
				standpoint, and in particular how the Potentiometer Oddity
				Degradation Effect, i.e PODE, can affect your ledgedashing.
			</p>
			<p>
				At one point, I was switching to and from various controllers
				after my main controller began acting erratically. Specifically,
				I couldn’t ledgedash as well as I used to, and I was fairly
				confident about the accuracy of my inputs. I chalked it up to
				the control stick becoming looser with age (I’ve been using it
				for about 2 years now), and resolved to learn to ledgedash with
				alternate methods in order to ledgedash more consistently across
				controllers. However, as I continued to test with my controller
				and a variety of potential substitutes I came across some very
				interesting phenomenon and realizations on why my inputs did
				what they did.
			</p>
			<h1 id="pode">PODE</h1>
			<p>
				<span>
					<Link
						className={styles.link}
						href="https://twitter.com/kadano/status/952672880512372736"
						target="_blank"
					>
						PODE,
					</Link>{" "}
					or the potentiometer oddity degradation effect, is a
					phenomenon which causes control stick inputs to be read in a
					delayed fashion, meaning some inputs are “skipped” if you
					move the control stick fast enough. As I switched from
					controller to controller, some of which had PODE and some of
					which did not, I noticed that they had an incredibly
					tangible effect on my ledgedashing. I first learned to
					ledgedash with the “optimal ledgedash angle”, described{" "}
					<Link
						className={styles.link}
						href="https://smashboards.com/threads/how-pre-ledgegrab-body-states-affect-your-ledgedash-timing.346128/page-2#post-16761783"
					>
						here
					</Link>{" "}
					by Kadano. As I tested this method on various controllers, I
					was struck that some controllers kept doing regular get up,
					while one controller in particular never failed to let go of
					ledge, no matter how far I pushed the angle, far past what
					Kadano had documented. Eventually, I turned on the input
					viewer in 20XX and saw what was happening. To demonstrate, I
					perform a single input diagonally downward and to the right.
					The potentiometer, however, reads something very different.
					Let's examine the input display. Use gfycats speed controls
					for more visibility.
				</span>
				<figure>
					<iframe
						title="diagonal"
						src="https://gfycat.com/ifr/DelayedEmbellishedBull"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="300px"
						height="300px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>A diagonal right input?</p>
					</figcaption>
				</figure>
			</p>
			<p>
				The controller I was using has strong horizontal PODE, so
				left/right inputs are delayed in a manner similar to buffering.
				However, vertical inputs are unaffected, so even for angle close
				to horizontal, the control stick first registers a nearly
				straight down input, then jumps to the horizontal angle. This
				results in amazing ledgedashes using the Kadano method, since it
				pretty much never does regular get up and guarantees a drop from
				ledge. Here are the numbers, frame by frame, for an input down
				and to the right.
				<figure>
					<div className={styles.podeImage}>
						<Image
							src="https://s3.r2dliu.com/assets/articles/ledgedash/pode.jpg"
							preview="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAUFBQUHBwYHBwoJCAgJCg8KCwoLCg8WDhAODhAOFhQYExITGBQjHBgYHCMpIiAiKTEsLDE+Oz5RUW0BBAQEBAQEBQUFBQcHBgcHCgkICAkKDwoLCgsKDxYOEA4OEA4WFBgTEhMYFCMcGBgcIykiICIpMSwsMT47PlFRbf/CABEIABUASAMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAGBwQFAAMIAv/aAAgBAQAAAADlVgjmgzAGSrmxzmcU2guAmGtWiuLyDJ8ZLqrr/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAECBQb/2gAIAQIQAAAAxnBm9Q2X/8QAGQEAAgMBAAAAAAAAAAAAAAAAAAECAwYF/9oACAEDEAAAANWSO1hFF1//xAArEAACAQMDAwMDBQEAAAAAAAABAgMEBREABhITIjEhMkEHFHEkJUJSkWL/2gAIAQEAAT8AXfG4IZEiWJT1I+EQaJfcR6a2XvW6yXmge5Wmkkt0qmOXlCq+jrjlnl6HW691XazXqqjp1XoI8ZJ6akEFVOqLfO5WftoKd8S8+6BSSpw4HkDxr6i7lmhqKOutNLFCKmNnMUaKyI2ELD/dUO/dwzGPpU0EnKPgOcKkF0OSfI1cNzTVmxKar+xgguVK3CTpooMoMg4EqCdQb+3ArlDBE7Ryqzhol9ntAP5J1s7c1VcqO60N1t1KsrCKSmmWNUYEHBUYJ8jTVMZnpE+7bgk2S+ByT8HGttXayUVxt0lwuUjU8bgyxceS/wCAa3hV/uVV+p5vJBCSMZU9q4IzqkqqERnqXWVDhPHk9o84Hwdb0uttqorZU2+q40oYrEAuMEIgcEH/AKGrVU06qhmrnhIaT0Ue3OMcfT51Jc7TNs2ampK1mniDtUsVPIgyIYzk+cahqo5KqYy1ZVDHGAQB34I9341tK62aGeriFxeWsn6Ipi6k8SHBb4GMrq27vulnlmakWBRI8bOjRLIhaHPEkOD/AG0m+Lxfq2npqpKYK8iZ4RKnsyQSFABPcdXS91dmviS0aojwxAK2OR4yR8Cp5Z+Dp/qZuCWBYGio+IQoONPGhwUKeUA+DrcVSYLdR4jQmbJY48HivqNP9S9zSQzxFqU9ZmaRzTRFyXGD3cdNd6m4WauulSsb1Ds5btwCSwzkDVt3/frTTx09P9uUjR0jEkEcnBXcyEAup+Tqz7huO4Kxmr+ixhUFeEax+ZC/8APk6//EACIRAAICAgEDBQAAAAAAAAAAAAECAAMEESESMUETFGKBof/aAAgBAgEBPwDKw8cVMfR2dHsCT9T2lBoQmoE9ImPiUNioWq5+Q5mLiUNXYDVwHbQIl2OgucKnSN+QfyFFPiGtO2oUUcanQoA4i01MNlZ//8QAHxEAAgICAwADAAAAAAAAAAAAAQIDBAAhERIxEzJi/9oACAEDAQE/AKl2xPJ0ktMqD9ADDesvakjFhlQOfGAyxesLbMMdhgmtqQPAN5buzwyRJFYO0HYgjeVLYjhHZ/lJPJJYEjBYmCsA3vuR2Jl2GxJpRzw2CaXkntkk0vb7nP/Z"
							width="600px"
							height="178px"
						/>
					</div>
					<figcaption className={styles.caption}>
						<p>Strong PODE (X input delayed until frame 3)</p>
					</figcaption>
				</figure>
				<figure>
					<div className={styles.podeImage}>
						<Image
							src="https://s3.r2dliu.com/assets/articles/ledgedash/nopode.jpg"
							preview="data:image/jpeg;base64,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"
							width="600px"
							height="178px"
						/>
					</div>
					<figcaption className={styles.caption}>
						<p>No PODE (X input read immediately)</p>
					</figcaption>
				</figure>
			</p>
			<p>
				This lines up pretty well with the input display's showing
				above. As a interesting sidenote, this particular controller’s
				PODE is so strong, the delay in inputs was visible in realtime.
				Here’s a comparison of quick dashdance inputs on the PODE
				controller vs a normal controller. Note how the stick seemingly
				teleports from one side to neutral to the other on the PODE
				inputs, without as many intermediate polls. Try using the gfycat
				slowdown arrow to see it in slow motion.
				<figure>
					<iframe
						title={"podeDashDance"}
						src="https://gfycat.com/ifr/DarlingVioletChimpanzee"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="300px"
						height="300px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>PODE</p>
					</figcaption>
				</figure>
				<figure>
					<iframe
						title="noPodeDashDance"
						src="https://gfycat.com/ifr/FrayedYawningAvocet"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="300px"
						height="300px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>No PODE</p>
					</figcaption>
				</figure>
			</p>
			<p>
				Here’s a comparison of spinning the stick in circles. Note the
				choppy, frenetic movement on the PODE controller. Again, slow
				motion is pretty cool to see here.
				<figure>
					<iframe
						title="podeCircle"
						src="https://gfycat.com/ifr/BogusIncredibleBaboon"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="300px"
						height="300px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>PODE</p>
					</figcaption>
				</figure>
				<figure>
					<iframe
						title="noPodeCircle"
						src="https://gfycat.com/ifr/ImportantGrotesqueArabianoryx"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="300px"
						height="300px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>No PODE</p>
					</figcaption>
				</figure>
			</p>
			<h1 id="optimizing">Optimizing Ledgedash</h1>
			<p>
				Armed with this new information, we can apply it to our
				advantage and modify the method by which we ledgedash to best
				suit the controller. At the start of this crusade, I had talked
				to various top players and examined players like Plup and Leffen
				who ledgedash extremely consistently using an alternate method:
				the “back” ledgedash. I've always ledgedashed with the Kadano
				method, which I’ll refer to from this point onward as “down”
				ledgedashing, since the input is generally in the downward
				direction to let go of ledge. However, “back” ledgedashers drop
				from ledge by pressing away on the stick, which has both pros
				and cons. The main pros are improved consistently dropping from
				ledge (fewer accidental regular get ups) and no accidental
				fastfall inputs. Hoping to improve my consistency across
				controllers, I spent a few weeks grinding out this method until
				I had it at a decent success rate. On my PODE controller, I
				could usually get anywhere from 12-15 frames of intangibility
				using the down ledgedash. But even after investing many hours
				into back ledgedashing, I consistently was losing several frames
				of actionable intangibility in comparison. I was again confident
				in my inputs, so I again recorded myself doing both methods and
				again, realized something was off. I’d been practicing on my
				PODE controller, since that’s the one I’m most likely to use in
				tournament, and hadn’t spent much time trying the back method on
				any other controllers. As a result, I forgot that PODE would
				invariably effect my back ledgedashes as well. The main drawback
				to the back ledgedash is that the stick needs to cover more
				distance in a short time, which requires some very quick inputs
				that ideally are frame perfect. Here’s a comparison of the
				inputs for back vs down:{" "}
				<figure>
					<div className={styles.ledgedashImage}>
						<Image
							src="https://s3.r2dliu.com/assets/articles/ledgedash/down.jpg"
							preview="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAUFBQUHBwYHBwoJCAgJCg8KCwoLCg8WDhAODhAOFhQYExITGBQjHBgYHCMpIiAiKTEsLDE+Oz5RUW0BBAQEBAQEBQUFBQcHBgcHCgkICAkKDwoLCgsKDxYOEA4OEA4WFBgTEhMYFCMcGBgcIykiICIpMSwsMT47PlFRbf/CABEIAB4AHgMBIgACEQEDEQH/xAAZAAADAAMAAAAAAAAAAAAAAAAEBggAAwf/2gAIAQEAAAAA541irbVXOReRUKxOgR+oX//EABYBAQEBAAAAAAAAAAAAAAAAAAMBBv/aAAgBAhAAAADVtV//xAAWAQEBAQAAAAAAAAAAAAAAAAABAgT/2gAIAQMQAAAAxyH/xAAqEAACAQMCBAQHAAAAAAAAAAABAgMABAURIQYTMUESI3GBIkJSYnKRsf/aAAgBAQABPwCKIzMQDoANWY9ABWH4VzWaiEmMwlzcIRqJpfIjPp4tzWT4fvMbJyL+ylsrg9A+6P8Ai42NOjRuVYaEVwjjYcrkLW1mIEMsjvMT3jhHiK+9YHN4jI2kAsEueUWMak2syLqjFNyV0A271xZiLXMYS6tplViV+Ans3ykVmECTqxG5G/qK4byRxuRgkHWGYSKPqU7MPcGsbnMPfxBxFzHA2lhPKmA+7wlT/RWe4llx635TOTzrMfKtJhFIYG001DoAwUddGJ3q/uFurliN1Tb3orrpuQRuCOoqHLZC2XQOrD9VPfXlyNHcKp7LQAA0Ff/EABwRAAICAwEBAAAAAAAAAAAAAAECBBEAAwUhMf/aAAgBAgEBPwDo9F47jXrq69znTmlKwcUy5O5wlEMGphkKCsRT7ZP05//EABoRAAIDAQEAAAAAAAAAAAAAAAEDABEhAhP/2gAIAQMBAT8ASod6Y5fmRUW0rysjGFhn/9k="
							height="200"
							width="200"
						/>
					</div>
					<figcaption className={styles.caption}>
						<p>Down ledgedash</p>
					</figcaption>
				</figure>
				<figure>
					<div className={styles.ledgedashImage}>
						<Image
							src="https://s3.r2dliu.com/assets/articles/ledgedash/back.jpg"
							preview="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAUFBQUHBwYHBwoJCAgJCg8KCwoLCg8WDhAODhAOFhQYExITGBQjHBgYHCMpIiAiKTEsLDE+Oz5RUW0BBAQEBAQEBQUFBQcHBgcHCgkICAkKDwoLCgsKDxYOEA4OEA4WFBgTEhMYFCMcGBgcIykiICIpMSwsMT47PlFRbf/CABEIAB4AHgMBIgACEQEDEQH/xAAZAAADAAMAAAAAAAAAAAAAAAAEBggDBQf/2gAIAQEAAAAA541irbXaGni8iqE6dwj8Qv8A/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwEG/9oACAECEAAAANW1X//EABYBAQEBAAAAAAAAAAAAAAAAAAECBP/aAAgBAxAAAADHIf/EACgQAAIBAwQBAwQDAAAAAAAAAAECAwAEBQYRITESQXGBEzNCUmFykf/aAAgBAQABPwCKIzMQOABuzHoAVh9K5rNRCTGYS5uEI3E0u0EZ9vLk1k9P3mNk+hf2UtlcegflH/q44NOjRuVYbEVpDGRZfI2lpL9qaRml/lIh5Ffmoxa2FkWZlighj8mboBV7Natw9tl8LdWs6KxK7IT2rehHsay6COdWI5I59xWm8kcbkYJB3DMJFH7KeGX5Bqw1Njsrj5LaRTcwSRNG6jhjGw2Kuu4Nam1TcYyCK2xt3C1ruUaCdy80K+JCmN134U/i5rIXC3VyxHKpx80V325II6I7FQ5bIWy+IdWH+VPfXlyNncKp9FoAAbCv/8QAHBEAAgIDAQEAAAAAAAAAAAAAAQIEEQADBSEx/9oACAECAQE/AOj0XjuNeurrOdOaUrBxTLk7nCUQwamGQoKxFPtk/Tn/xAAaEQACAwEBAAAAAAAAAAAAAAABAwARIQIT/9oACAEDAQE/AEqHYsxy/MiotpXlZGMLDP/Z"
							height="200"
							width="200"
						/>
					</div>
					<figcaption className={styles.caption}>
						<p>Back ledgedash</p>
					</figcaption>
				</figure>
			</p>

			<p>
				If you have strong PODE and use the back method, the PODE delays
				both the initial back input as well as the forward input that
				happens afterward, reducing the distance and intangibility of
				the ledgedash.
			</p>
			<h1 id="breakdown">Ledgedash Breakdown</h1>
			<p>
				Let’s do a breakdown to see exactly where the problems are. The
				timing and frame data varies from character to character, so for
				simplicity I’ll be focusing on my character of choice, Fox.
				However, the ideas are generally applicable to any character
				that utilizes ledgedashes. Ledgedashing is typically done as
				follows:{" "}
			</p>

			<p>Step 1. Drop from ledge</p>
			<p>Step 2. Double jump</p>
			<p>Step 3. Waveland onto stage</p>
			<p>
				For step 1, we can break down ledgedashing further into “back”
				ledgedashing and “down” ledgedashing, depending on the input
				done to drop from ledge. Ideally, you want to double jump the
				frame after you drop from the ledge. Otherwise, you spend some
				time falling, which means that you’ll be vertically lower from
				the ledge and it’ll take more time to double jump above it,
				wasting intangibility frames, which of course means a worse
				ledgedash. In addition, it makes it easier to SD since
				airdodging too early means you won’t make it above the ledge and
				onto the stage. If you drop with down, then ideally you’ll want
				to use a light tap, to keep within the ledgedrop no fastfall
				zone shown above. If you get a fastfall, you are more likely to
				fall further if you don’t input a perfect double jump
				afterwards, which will lose frames for the ledgedash. In
				addition, you’ll want to angle your control stick slightly
				forward in order to make getting a good airdodge angle
				afterwards easier. This will take some practice to get used to
				and train your muscle memory so that you don’t accidentally do
				regular getups as often. If you drop with back, you avoid the
				fast fall issues, but you also have more distance to cover with
				your fingers/control stick, since you need to now move the
				control stick to the airdodge down position.
			</p>
			<p>
				We want to double jump as early as possible, so that would
				ideally be the frame after dropping from the ledge. Here's where
				PODE gets involved. Supposing you have a controller with strong
				horizontal pode, and you perform the back ledgedash, the quick
				left/right flick causes some issues. Because of PODE, the input
				can become delayed, and as shown in the videos, the control
				stick can get "stuck" for a frame or two at one side of the
				stick. So in the event that our second input gets delayed, our
				double jump occurs not toward the stage as intended, but
				sometimes backwards or maybe straight up. This loses some
				actionable invulnerability frames, depending on your inputs.
				Jumping forward gives you some very important momentum that both
				lets you land earlier and move further during the waveland. Now
				that we know what we’re looking for, we can even see in realtime
				the effects of jumping backwards vs forwards for a back
				ledgedash.
				<figure>
					<iframe
						title="back"
						src="https://gfycat.com/ifr/ExhaustedCloudyBluebreastedkookaburra"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>Backward Jump</p>
					</figcaption>
				</figure>
				<figure>
					<iframe
						title="forward"
						src="https://gfycat.com/ifr/HomelyNimbleGroundbeetle"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>Forward Jump</p>
					</figcaption>
				</figure>
				<figure>
					<iframe
						title="overlaid"
						src="https://gfycat.com/ifr/YellowishLegitimateGartersnake"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>Overlaid</p>
					</figcaption>
				</figure>
			</p>

			<p>
				The only difference between these two examples is the jump
				direction; everything else is the same. You lose a significant
				amount of distance, and it only worsens when other factors
				compound, such as bad timing or suboptimal airdodge angles. Even
				without PODE, this is a pretty important factor that a lot of
				players don’t take into account while ledgedashing. As a result,
				I’ve begun skewing my input for my double jump towards being one
				frame late, while holding forward to get the direction right
				during the first frame. Empirical testing shows me that I’m 90%+
				consistent on aiming for two frame windows, so I’ll aim for
				double jumping either frame perfect or one frame late, which
				sacrificies only two frames of actionable intangibility at
				worst. This also prevents tournament winners from pressing the
				double jump a frame too early.
			</p>
			<h1 id="conclusion">Conclusion/TL;DR</h1>
			<p>Main takeaways:</p>
			<p>
				1. PODE affects which ledgedash method you should use! Both
				methods can result in consistent, near perfect ledgedashes, but
				adjusting for your controller might be more optimal than what
				you’re currently more comfortable with. Ideally, learn both
				methods and switch as needed.
			</p>
			<p>
				2. If your controller has strong PODE, consider trying the down
				ledgedash method, and keep in mind that with very strong PODE,
				using the back method will probably cause you to lose frames,
				especially if you’re going for a tight, near perfect ledgedash.
			</p>
			<p>
				3. If your controller does not have strong PODE, the back
				ledgedash is probably better and more consistent, since you
				don’t have to deal with accidental fast fall inputs and are less
				likely to do regular get ups from ledge by accident.
			</p>
			<p>
				4. When doing back ledgedashes, perform the forward input toward
				stage on the frame after dropping from ledge, and then aim to do
				the double jump another frame afterward. This will give you the
				most consistent forward double jumps, since being one frame
				early means you’ll still get the forward jump, and will go a
				long way toward preventing tournament winners.
			</p>

			<p>Happy ledgedashing!</p>

			<p>
				<i>Last edited April 16th, 2018</i>
			</p>
		</Fragment>
	);
	return (
		<Fragment>
			<Breakpoint
				className={cn(
					"scrollContainer",
					styles.Ledgedash,
					styles.mobile
				)}
				xs={true}
				only={true}
			>
				{articleBody}
			</Breakpoint>
			<Breakpoint
				className={cn("scrollContainer", styles.Ledgedash)}
				s={true}
				up={true}
			>
				{articleBody}
			</Breakpoint>
		</Fragment>
	);
}

export default Ledgedash;
