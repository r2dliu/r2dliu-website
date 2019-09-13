import React, { Fragment } from "react";
import Breakpoint from "react-socks";
import cn from "classnames";
import styles from "./Autocancel.module.scss";

function Autocancel() {
	const articleBody = (
		<Fragment>
			<p>September 13th, 2019, by David "R2DLiu" Liu</p>
			{/* TODO: remove */}
			<p>- Article is a WIP -</p>
			<p>
				<i>If you pause Gfycat, you can advance frame by frame!</i>
			</p>
			<h1 id="introduction">{"Introduction"}</h1>
			<p>
				Fox is one of the best and most versatile characters in the
				game. However, he definitely isn’t a character that’s known for
				the usage of autocancel aerials, compared to say, Falco or Sheik
				However I’ve found a lot of effective ways to use them on Fox in
				all kinds of situations, ranging from pretty niche to fairly
				common. In this article, I'll go through and describe and
				evaluate some of these situations.
			</p>
			<h1 id="whatisit">What is Autocancelling?</h1>
			<p>
				<span>
					For those who might not know, autocancelling, abbreviated
					henceforth as AC, is a technique where one lands during
					certain startup frames or certain ending frames of an aerial
					attack. Landing during these frame windows causes the
					character to land with only four frames of lag without
					requiring any additional inputs, unlike an L-cancel. The way
					I like to think about it is that landing during an
					autocancel window is basically the same as if you had jumped
					and landed without doing an aerial at all! You can read more
					details and find some more examples{" "}
					<a
						href="https://www.ssbwiki.com/Auto-canceling"
						target="_blank"
					>
						here.
					</a>
				</span>
			</p>
			<p>
				The important takeaway is that autocancels can let you move
				faster while landing from an aerial, opening the door for all
				kind of mix-ups and techniques.
			</p>
			<h1 id="breakdown">Autocancel Up-Air</h1>
			<p>
				Up-air is a fantastic tool for Fox. It kills, combos, looks
				swaggy, it does it all. It lasts a total of 39 frames, hitting
				on frames 8-9 and 11-14. It autocancels before frame 7 and after
				frame 26, with 9 frames of L-cancelled lag.
			</p>
			<h2>Sharking Top Platform</h2>
			<p>
				Fox’s uair boasts decent range + disjoint, good combo potential
				at lower percents, and high kill potential at higher percents.
				This makes it a very good candidate for approaching opponents on
				platforms from below. In particular, uair is extremely good at
				hitting characters on top platform. A full hop into instant uair
				followed by a fast fall easily land during the autocancel
				window. On top of all of this, most characters don’t have good
				hitboxes that reach below them, so this is pretty safe to just
				throw out constantly and get rapid fire hitboxes that can net
				you more or less free combos/kills. This works particularly well
				on Yoshi's, where you can reach top platform with just your full
				hop. On stages like Battlefield or Dreamland, you can still
				accomplish something similar by rolling both jump buttons or
				using tap jump with a jump button to get an instant double jump,
				allowing you to reach top platform and fall into an autocancel
				afterwards
			</p>
			<p>
				Some useful scenarios to watch out for include, catching shield
				drops, catching attempts to escape to the side platforms, and
				shield pokes/pushoffs. These are just a few of many situations,
				but generally the idea is that this is a very advantageous
				situation for Fox, with little likelihood of getting reversal’d,
				and lots of opportunities for reads and mixups after the
				autocancel leaves you so actionable.
			</p>
			<p>
				<figure>
					<iframe
						title="sharking"
						src="https://gfycat.com/ifr/warmheartedcleanjenny?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>
							Some toy examples of sharking with uair. Every uair
							here autocancels afterward, leaving generous amounts
							of time for mixups or followups
						</p>
					</figcaption>
				</figure>
			</p>
			<h2>KJH Aerial Interrupt</h2>
			<p>
				This piece of tech utilizes what is known as an aerial
				interrupt. The simplified explanation is that by dropping low
				from ledge, double jumping, and uairing barely above the ledge,
				Fox can land during the uair, autocancelling it and leaving him
				actionable four frames afterward. This is an unreactable mixup
				because it looks almost exactly like refreshing near the ledge,
				and is dangerous for the opponent to contest because they would
				be in ledgedash -> attack range.
			</p>
			<p>
				<span>
					Watch KJH’s amazing video{" "}
					<a
						href="https://www.youtube.com/watch?v=66KCwTJLtj8"
						target="_blank"
					>
						here
					</a>
					, which has many more examples and more detailed
					explanation.
				</span>
			</p>
			<p>
				<figure>
					<iframe
						title="aerialinterrupt"
						src="https://gfycat.com/ifr/corruptdifferenticelandgull?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>
							<span>
								From KJH's video, which you should{" "}
								<a
									href="https://www.youtube.com/watch?v=66KCwTJLtj8"
									target="_blank"
								>
									watch
								</a>
							</span>
						</p>
					</figcaption>
				</figure>
			</p>
			<h2>Platform Techchasing</h2>
			<p>
				Similarly to KJH's tech, you can also take advantage of uair's
				early autocancel window to tech chase. By performing an uair
				right before landing while full jumping to a platform, you can
				leave yourself actionable for a followup. This is faster than
				wavelanding depending on the stage (a handful of frames faster
				on Dreamland, one frame faster on Battlefield, varies on
				Fountain). This is arguably superior to both regular jump + fast
				fall as well as wavelanding. Wavelanding needs to be frame
				perfect to be as fast as possible, and even then is usually
				slower. Airdodging too early results in a complete loss of the
				techchase situation. Doing an uair instead of just jumping and
				landing prevents you from accidentally falling through the
				platform from your fastfall input and ensures you land on the
				platform.
			</p>
			<p>
				<figure>
					<iframe
						title="techchase"
						src="https://gfycat.com/ifr/illancientilladopsis?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>AC uair tech chase</p>
					</figcaption>
				</figure>
			</p>
			<p>
				<span>
					Side note: Some of you might be wondering about laser lands.{" "}
					<a
						href="https://www.youtube.com/watch?v=NNmaaFCFtLo"
						target="_blank"
					>
						Laser landing
					</a>{" "}
					can be significantly faster for going from ground to top
					platform because of the no impact land, but uair is just as
					good for going from ground to side platform or side platform
					to top platform, since there is no way to achieve a fast NIL
					in these scenarios and both uair and laser drag your ECB
					down.
				</span>
			</p>
			<p>
				Importantly, uair is also much less reactable for the opponent.
				The initial animation doesn’t look that different from Fox’s
				jump, whereas laser has a very distinct beginning animation
				where he pulls out the gun. The laser also has an easily
				distinguishable audio cue, whereas early AC uair has none.
			</p>
			<h1 id="bair">Autocancel Back-Air</h1>
			<p>
				Back-air is an absolutely ridiculous move. It, too, can kill,
				combo, and look swaggy. It has an enormous hitbox and stays
				active forever. It lasts a total of 39 frames, hitting on frames
				4-19(!). It autocancels before frame 3 and after frame 24, with
				10 frames of L-cancelled lag.
			</p>
			<h2 id="walling">Center Stage Walling</h2>
			<p>
				Like the sharking uair mentioned earlier, full hop instant
				back-air also autocancels with a fast fall, with lots of
				leniency. This typically reaches around platform height, and is
				great for walling out all kinds of approaches.
			</p>
			<p>
				<figure>
					<iframe
						title="walling"
						src="https://gfycat.com/ifr/linearsizzlingafricanharrierhawk?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>Walling with AC bair</p>
					</figcaption>
				</figure>
			</p>
			<p>
				AC bair is also incredibly useful for setting up all kinds of
				weak hit combos. This is pretty self-explanatory.
			</p>
			<p>
				<figure>
					<iframe
						title="weakhit"
						src="https://gfycat.com/ifr/amazingrelievedgossamerwingedbutterfly?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>Weak hit AC bair combo</p>
					</figcaption>
				</figure>
			</p>
			<h2 id="shieldpressure">Shield Pressure</h2>
			<p>
				Like Falco, Fox can set up shield pressure with a AC bair. Note
				that neither Fox nor Falco AC bair are quite as safe as late
				aerials and have plenty of counterplay, but when set up
				correctly they’re only slightly negative on block and can catch
				people pressing buttons. But unlike Falco, Fox cannot auto
				cancel his bair out of short hop. Instead, he can only setup
				this AC pressure in a few select situations with full hop.
				Here’s some toy examples.
			</p>
			<p>
				<figure>
					<iframe
						title="pressure"
						src="https://gfycat.com/ifr/shamefulmessydrake?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>AC bair platform shield pressure</p>
					</figcaption>
				</figure>
			</p>
			<p>
				This situation is particularly good because many players aren’t
				expecting this pressure to be safe, and often aren’t ready to be
				shined off the side of the platform. I’ve gotten a lot of
				shinespikes and low percent gimps this way.
			</p>
			<p>
				You can set this kind of pressure up on the ground also. This
				often leads to bad attempts to move out of shield and results in
				them getting shined. You can also react and punish rolls. Watch
				out though: this grounded version is{" "}
			</p>
			<p>1. Much more difficult to time than the platform version</p>
			<p>
				2. Doesn't work as well vs shorter characters or dash dancing
				opponents, and
			</p>
			<p>3. Is much easier to react to and crouch cancel.</p>

			<p>
				<figure>
					<iframe
						title="grounded"
						src="https://gfycat.com/ifr/anxiouslongcormorant?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>AC bair ground shield pressure</p>
					</figcaption>
				</figure>
			</p>

			<p>
				Overall though, these are unusual patterns that most players
				aren't used to seeing from Fox, and bair is usually one of Fox's
				laggier moves that people can whiff punish best. The AC shield
				pressure can be as good as only -1 on block.
			</p>

			<h2>Edgeguarding</h2>

			<p>
				Autocancelling bair plays a large role in edgeguarding. There
				are a couple different timings for this, but done correctly,
				rising bair from ledge can autocancel with a pretty lenient
				window, even if you drop low enough to cover low/horizontal
				recoveries. The low lag of autocancel ensures you’ll have time
				to cover a high recovery onto stage or a drift back to ledge
				afterward. This is particularly good vs spacies, and is probably
				the best default edgeguard for opponents you don’t have a read
				on. It doesn't cover 100% of options, but covers maybe 80+% of
				them, and sets you up for future reads for the other 20%.
			</p>

			<p>
				<figure>
					<iframe
						title="grounded"
						src="https://gfycat.com/ifr/limpspryfrillneckedlizard?hd=1"
						className={styles.iframe}
						frameBorder="0"
						scrolling="no"
						width="640px"
						height="480px"
						allowFullScreen
					/>
					<figcaption className={styles.caption}>
						<p>AC bair ground shield pressure</p>
					</figcaption>
				</figure>
			</p>

			<h1>Other Aerials/Conclusion</h1>
			<p>
				Fox's other aerials don't have a lot of use for their
				autocancels. Nair and fair don't autocancel even out of
				fullhops. Dair has some extremely use niches where a full hop
				instant drill can auto cancel without a fast fall, taking on
				kind of a similar role as a full hop pull back nair that can't
				be crouch cancelled, but it's easily reactable and can be
				punished by jumping into it.
			</p>
			<p>
				<span>
					Many of the situations I covered today are pretty well
					known, while some might be a little more unusual. Try
					incorporating them and discovering usages for your own
					variations. If you have a more unique scenario I didn't
					cover, you can DM or tweet at me on{" "}
					<a href="https://twitter.com/R2_DLiu" target="_blank">
						Twitter.
					</a>{" "}
					Thanks for reading!
				</span>
			</p>
			<p>
				<i>Last edited September 13th, 2019</i>
			</p>
		</Fragment>
	);
	return (
		<Fragment>
			<Breakpoint
				className={cn(
					"scrollContainer",
					styles.Autocancel,
					styles.mobile
				)}
				xs={true}
				only={true}
			>
				{articleBody}
			</Breakpoint>
			<Breakpoint
				className={cn("scrollContainer", styles.Autocancel)}
				s={true}
				up={true}
			>
				{articleBody}
			</Breakpoint>
		</Fragment>
	);
}

export default Autocancel;
