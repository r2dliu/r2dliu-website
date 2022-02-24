import React, { Fragment } from "react";
import Breakpoint from "react-socks";
import cn from "classnames";
import useScript from "helpers/useScript";
import Image from "components/Image";
import styles from "./Pulley.module.scss";


function Pulley(): React.ReactElement {
	const Instagram = useScript('https://www.instagram.com/embed.js', 'Instagram')
	if (!Instagram) {
		console.log("failed to load insta embed script")
	}
	const articleBody = (
		<Fragment>
			<p>December 29th, 2021, by David "R2DLiu" Liu</p>
			<h1 id="introduction">{"Introduction"}</h1>
			<p>
				I blew out a pulley pretty recently, and it sucks, for lack of a better word.
				I felt compelled to do a writeup on the whole process from start to finish, as
				well as summarize all the useful information I've accumulated over this time.
				I'll actively update this page every few weeks or so to continue reporting on 
				results and my healing.
			</p>
			<p>
				Pulley injuries are widely familiar amongst climbers, 
				but the literature surrounding it is relatively sparse. 
				The physics of the system of tendons of ligaments in the hand
				is complex and nonlinear. Modelling of the system is basically nonexistent.
				I'll attempt to piece together what I think are the most essential
				pieces from the last few decades of literature, but feel free to skip
				this section if you're mostly interested in my rehab and recovery process.	
			</p>
			<h2 id="anatomy">{"Anatomy"}</h2>
			<p>
				<figure>
					<div className={styles.anatomy}>
						<Image
							src="https://s3.r2dliu.com/assets/articles/pulley/anatomy.jpg"
						/>
					</div>
				</figure>
				Pulleys are ligaments in fingers that basically form a tunnel for the
				flexor tendons to go through, as pictured above. Flexor tendons are connected 
				to the muscles/bone in your forearm, and glide back and forth
				through the tunnel according to muscle tension. When the muscles in the forearm
				are contracted, the flexor tendons pull the tips of your fingers towards the arm,
				causing the fingers to come with them and bend accordingly. However, if the
				fingers encounter resistance, such as when grabbing an edge, the flexor tendons push
				against the pulley system, which normally holds up quite well.

				There are five "annular pulleys", labelled A1-A5, and three "cruciform pulleys", 
				labelled C1-C3. Our focus will be on the annular pulleys which are 
				at the greatest risk of injury from climbing.

			</p>
			<h2 id="injury">{"Types of injury"}</h2>
			<p>	
				Injuries to the pulley system are uncommon among the general population. 
				Crowley and Zafonte note that pulley damage tends to occur in high level athletes 
				that generate insane amounts of force on their fingers, namely professional 
				baseball pitchers and rock climbers. Other cases are usually the result of 
				losing control while lifting large, heavy objects or jamming a finger/hand 
				during contact sports, such as Brazilian jiu-jitsu or American football. 
			
			</p>
			<p>
				Marco et al. did a study back in the 90s on stress testing the pulley system
				and seeing how fingers reacted under large loads. They tested 21 fingers, taken
				from recently deceased individuals, and loaded them into what amounted to 
				a sophisticated torture device, applying weights to the pulley system until
				something broke. 

				<figure>
					<Image
						src="https://s3.r2dliu.com/assets/articles/pulley/marco.jpeg"
						width="400"
					/>
					<div>
						<figcaption className={styles.caption}>
								<p>The sophisticated torture device</p>
						</figcaption>
					</div>
				</figure>
				
			</p>
			<p>	
				The results:

				<ul>
					<li>2 fingers fractured before the pulleys ruptured (wow).</li>
					<li>In the remaining 19 fingers, pulleys ruptured before anything
						else in the fingers failed.
					</li>
					<li>A4 ruptured first in 14 fingers. (p {"<"} 0.001)</li>
					<li>A2 ruptured first in 3 fingers. </li>
					<li>In one finger, A3 and A4 ruptured simultaneously.</li>
					<li>In one finger, A2, A3, and A4 ruptured simultaneously.</li>
				</ul> 
			
				In rock climbing, generally the A4 and the A2 are the most commonly injured,
				and they are also the pulleys most directly responsible for finger strength 
				and range of motion in pulling/gripping.
			</p>
			<p>
				The video below is one of the best visualizations I've seen:

				<figure>
					<iframe 
						src="https://player.vimeo.com/video/394854534?h=4661db2ae2" 
						className={styles.vimeo}
						frameBorder="20" 
						allow="autoplay; fullscreen; picture-in-picture" 
					></iframe>
				</figure>
			</p>
			
			<h1 id="overview">{"Personal Overview"}</h1>
			<p>
				I was introduced to climbing around 2015 or 2016. It didn't hook me 
				immediately, but by the time I was a senior in college, around 2018, 
				I was an active member of our Outsiders Club, which provided free trips 
				to our local climbing gym every Friday night. My redpoint level quickly
				bounced from around V2-3 to V6-7 in these couple years, without any real 
				training or other physical activity. Once I graduated and moved to San Francisco,
				I was heading to Dogpatch multiple times a week. By mid 2019, I'd broken into 
				V8ish territory, though I now consider Dogpatch setting to be relatively soft.
				Late 2019/early 2020 saw me move back to the east coast, get into powerlifting, 
				learn to eat and train properly, and increase my rate of improvement. Late 2021 
				saw me able to dayflash most indoor V7s, crush most V8s within a session or two,
				and finally break into sending V9/projecting V10 territory.
			</p>
			<p>Then this happened: </p>
			{/* eslint-disable max-len */}
			<p>
				<figure className={styles.embed}>
					<blockquote
						className="instagram-media"
						data-instgrm-permalink="https://www.instagram.com/tv/CWe1QF1jWzO/?utm_source=ig_embed&amp;utm_campaign=loading"
						data-instgrm-version="14"
						style={{ "background": "#FFF", "border": "0", "borderRadius": "3px", "boxShadow": "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)", "margin": "1px", "maxWidth": "540px", "minWidth": "326px", "padding": "0", "width": "calc(100% - 2px)" }}
					>
						<div style={{ "padding": "16px" }}>
							<a
								href="https://www.instagram.com/tv/CWe1QF1jWzO/?utm_source=ig_embed&amp;utm_campaign=loading"
								style={{ "background": "#FFFFFF", "lineHeight": "0", "padding": "0 0", "textAlign": "center", "textDecoration": "none", "width": "100%" }}
								target="_blank"
							>
								<div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }}>
									<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "50%", "flexGrow": "0", "height": "40px", "marginRight": "14px", "width": "40px" }}></div>
									<div style={{ "display": "flex", "flexDirection": "column", "flexGrow": "1", "justifyContent": "center" }}>
										<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "4px", "flexGrow": "0", "height": "14px", "marginBottom": "6px", "width": "100px" }}></div>
										<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "4px", "flexGrow": "0", "height": "14px", "width": "60px" }}></div>
									</div>
								</div>
								<div style={{ "padding": "19% 0" }}></div>
								<div style={{ "display": "block", "height": "50px", "margin": "0 auto 12px", "width": "50px" }}>
									<svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg>
								</div>
								<div style={{ "paddingTop": "8px" }}>
									<div style={{ "color": "#3897f0", "fontFamily": "Arial,sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "550", "lineHeight": "18px" }}>
										View this post on Instagram
										</div>
								</div>
								<div style={{ "padding": "12.5% 0" }}></div>
								<div style={{ "display": "flex", "flexDirection": "row", "marginBottom": "14px", "alignItems": "center" }}>
									<div>
										<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "50%", "height": "12.5px", "width": "12.5px", "transform": "translateX(0px) translateY(7px)" }}></div>
										<div style={{ "backgroundColor": "#F4F4F4", "height": "12.5px", "transform": "rotate(-45deg) translateX(3px) translateY(1px)", "width": "12.5px", "flexGrow": "0", "marginRight": "14px", "marginLeft": "2px" }}></div>
										<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "50%", "height": "12.5px", "width": "12.5px", "transform": "translateX(9px) translateY(-18px)" }}></div>
									</div>
									<div style={{ "marginLeft": "8px" }}>
										<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "50%", "flexGrow": "0", "height": "20px", "width": "20px" }}></div>
										<div style={{ "width": "0", "height": "0", "borderTop": "2px solid transparent", "borderLeft": "6px solid #f4f4f4", "borderBottom": "2px solid transparent", "transform": "translateX(16px) translateY(-4px) rotate(30deg)" }}>
										</div>
									</div>
									<div style={{ "marginLeft": "auto" }}>
										<div style={{ "width": "0px", "borderTop": "8px solid #F4F4F4", "borderRight": "8px solid transparent", "transform": "translateY(16px)" }}></div>
										<div style={{ "backgroundColor": "#F4F4F4", "flexGrow": "0", "height": "12px", "width": "16px", "transform": "translateY(-4px)" }}></div>
										<div style={{ "width": "0", "height": "0", "borderTop": "8px solid #F4F4F4", "borderLeft": "8px solid transparent", "transform": "translateY(-4px) translateX(8px)" }}></div>
									</div>
								</div>
								<div style={{ "display": "flex", "flexDirection": "column", "flexGrow": "1", "justifyContent": "center", "marginBottom": "24px" }}>
									<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "4px", "flexGrow": "0", "height": "14px", "marginBottom": "6px", "width": "224px" }}></div>
									<div style={{ "backgroundColor": "#F4F4F4", "borderRadius": "4px", "flexGrow": "0", "height": "14px", "width": "144px" }}></div>
								</div>
							</a>
							<p style={{ "color": "#c9c8cd", "fontFamily": "Arial,sans-serif", "fontSize": "14px", "lineHeight": "17px", "marginBottom": "0", "marginTop": "8px", "overflow": "hidden", "padding": "8px 0 7px", "textAlign": "center", "textOverflow": "ellipsis", "whiteSpace": "nowrap" }}>
								<a
									href="https://www.instagram.com/tv/CWe1QF1jWzO/?utm_source=ig_embed&amp;utm_campaign=loading"
									style={{ "color": "#c9c8cd", "fontFamily": "Arial,sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "normal", "lineHeight": "17px", "textDecoration": "none" }} target="_blank"
								>
									A post shared by David (@r2dliu)
									</a>
							</p>
						</div>
					</blockquote>
					<div>
						<figcaption className={cn(styles.caption, styles.insta)}>
							<p>The price of progress</p>
						</figcaption>
					</div>
				</figure>
			</p>
			{/* eslint-enable max-len */}
			<p>
				On November 19th, 2021, I pull a little too hard on a V9 with small pockets 
				and snap the A4 pulley in the middle finger of my right hand.
			</p>
			<h1 id="prognosis">{"Diagnosis/Prognosis"}</h1>
			<p>
				I instantly knew that I'd broken a pulley, despite having never even 
				remotely injured one before. I felt something simply give way and then
				felt a slight shockwave of force, and there was no room for doubt.
				The breaking of the pulley itself didn't hurt much if at all. 
				My finger almost immediately began swelling and felt numb and buzzed,
				similar to the way your arm might feel after hitting your funny bone.
				Attempting to hold anything with it resulted in nothing, as if it wasn't
				connected to my brain anymore. My finger lost so much range of motion 
				and strength that I was unable to use it with my thumb to pinch the power button 
				on my phone to turn the screen on, and had to use the index finger instead.
			</p>
			<p>
				First order of business was to find a hand specialist and confirm the injury.
				While there was a distinct pop at time of injury, audible even in the video, 
				pops don't always mean pulley ruptures. Even though I was sure in my case, it 
				is still important to rule out other complications, like bone fractures, and see
				the total extent of the damage.
			</p>
			<p>	
				It's generally difficult to find doctors who understand the severity of
				a pulley injury for a climber. I saw three different hand surgeons, two
				of which had never seen a pulley injury before. Ultrasound is the gold standard
				and the only modality that allows viewing of the tendons in real-time [4]. 
				I managed to procure an MRI, an xray, and an ultrasound viewing, and confirmed 
				a full, isolated A4 rupture with no other damage to the hand/finger.
				Expected news, but still a heavy hit.
			</p>
			<p>	
				Schöffl et al. was the first to write a comprehensive summary paper on finger pulley
				injuries back in 2006. Alongside other useful information, they categorize 
				the severity of injuries into an easily parsable table:

				<figure>
					<Image
						src="https://s3.r2dliu.com/assets/articles/pulley/schoffl.jpg"
					/>
				</figure>
			</p>
			<h1 id="treatment">Treatment</h1>
			<p>
				Treatment, as you might imagine, is not an incredibly well researched subject
				for an injury that is so uncommonly seen. The vast majority of papers on the 
				subject comes from a few dedicated individuals who happen to be both hand
				surgeons and climbers, a very small overlap. Many of
				their ideas converge on the concept of what the papers call TPD, or tendon-phalanx 
				distance. 
			</p>
			<h2 id="background">Background</h2>
			<p>
				The pulleys' jobs, as pictured above, is to hold the flexor tendon close
				to the bone so it can bend the fingers properly when force is exerted. Injury to
				the pulleys can stretch or break them, and the result is that the tendon sits 
				further away from the bone than is normal. The distance between the tendon and 
				the bone is what TPD refers to. This distance is normally very small, ranging from
				0-1 mm in healthy, uninjured pulleys. In injured pulleys, as you might expect, 
				the tendon pulls much further away.

				<figure>
					<Image
						src="https://s3.r2dliu.com/assets/articles/pulley/mri.jpg"
						width="400"
					/>
					<div>
						<figcaption className={styles.caption}>
							<p>
								Example MRI of a broken A2 Pulley. Note how the tendon 
								(black) moves away from the bone (white) as the finger is 
								flexed (b, c, d). Normally, the pulley should hold it 
								from 0-1 mm away from the bone. Injured pulleys often pull 
								{" >"} 4 mm away. 
							</p>
						</figcaption>
					</div>
				</figure>

				When pulleys heal, whether the finger recovers range of motion and strength is 
				strongly correlated with the resulting TPD. If the finger heals in such a way 
				that the tendon stays close to the bone, generally people recover fine. Others who
				find loss of strength, flexibility, and range of motion often have larger TPD when
				measured via MRI or ultrasound. We've now set the stage for Schneeberger and 
				Schweizers' idea, which seems intuitive and is a reasonable leap in logic from 
				our prior research.
			</p>
			<h2 id="ring">Pulley Rings</h2>
			<p>
				Schneeberger and Schweizer released some highly intuitive research on the usage of 
				"pulley protection splints", which I'll refer to as pulley rings from here on.
				The idea is stunningly simple: create a tight, well fitting ring out of
				thermoplastic, shaped in such a way as not to limit blood flow, and wear it 24/7
				for two months post injury. The ring squeezes the finger vertically,
				pushing the injured tendon/pulley closer to its anatomically correct position, 
				but is shaped in such a way that it has gaps on the sides, where the arteries
				send blood and nutrients to the finger, so it does not inhibit blood flow.
				Their paper tested this idea on 47 professional/high level climbers, with this 
				striking line in their results: "PPS treatment decreased mean ± SD TPD from 
				4.4 ± 1.0 mm to 2.3 ± 0.6 mm after A2 pulley rupture and from 2.9 ± 0.7 mm to
				2.1 ± 0.5 mm after A4 pulley rupture.Tendon-phalanx distance was reduced in all 
				patients. Finger range of motion (n = 42) and finger strength (n = 22) did
				not differ significantly between treated and contralateral sides." p values for
				both A4 and A2 pulleys were {"<"} 0.001. I showed this paper to my surgeon and he 
				immediately seconded the protocol, as did V. Schöffl, who I actually reached out to 
				on Instagram (legend). This is the protocol I have been following to this day 
				and what I feel is the best possible treatment one can do for a pulley injury.
			</p>
			<p>
				<figure>
					<Image
						src="https://s3.r2dliu.com/assets/articles/pulley/ring.jpg"
						width="800"
					/>
					<div>
						<figcaption className={cn(styles.caption, styles.wide)}>
							<p>
								Example of pulley ring and function 
							</p>
						</figcaption>
					</div>
				</figure>
				If you are injured and need one of these, you can find an extraordinarily
				detailed guide to make one of these rings {" "}
				<a
					href="https://theclimbingdoctor.com/pulleyprotection/"
					target="_blank"
					rel="noreferrer"
				> 
					here
				</a> 
				
				. You can also show that page to your physical therapist and have them make one
				for you, depending on what is financially feasible. Another alternative is made
				by{" "}
				<a
					href="https://www.amazon.com/NiceClimbs-Pulley-Climbing-Finger-Splint/dp/B088MM4937"
					target="_blank"
					rel="noreferrer"
				>
					NiceClimbs
				</a>, sold on Amazon with very fast shipping. These come in a range of sizes and
				are, in my opinion, very functional but pretty uncomfortable. I used them until I 
				could make a custom one to fit my finger. A final choice is the{" "}
				<a
					href="https://rocknsport.square.site/"
					target="_blank"
					rel="noreferrer"
				>
					SPOrt™ 	
				</a>, which basically comes with a kit for you to make your own ring. All are good
				options.
			</p>
			<h2 id="rehab">Rehab</h2>
			<p>
				Alongside wearing a pulley ring, I initially began with 
				some of the protocols encouraged by the well known 
				Esther Smith, which is detailed in an{" "}
				<a
					href="https://www.blackdiamondequipment.com/en_US/stories/experience-story-esther-smith-nagging-finger-injuries/"
					target="_blank"
					rel="noreferrer"
				>
					excellent article
				</a>.
				A few weeks after injury, I also began performing{" "} 
				<a
					href="https://en.wikipedia.org/wiki/Blood_flow_restriction_training"
					target="_blank"
					rel="noreferrer"
				>
					blood flow restriction training	
				</a>
				, and a few weeks later, once I felt comfortable hanging from edges again,
				finally added on Eva Lopez's famous{" "}
				<a
					href="http://en-eva-lopez.blogspot.com/2018/05/fingerboard-training-guide-II-Maxhangs-SubHangs-and-Inthangs-methodology.html"
					target="_blank"
					rel="noreferrer"
				>
					maximal hang training 	
				</a>
				{" "}using her Transgression hangboard.
			</p>
			<h2 id="surgery">Surgery</h2>
			<p>
				The medical field appears to refer to non-surgical methods of treatment as
				"conservative". With regard to pulley ruptures, the current literature
				is unable to determine whether surgical outcomes are plainly better or 
				worse than conservative treatment. Indeed, even determining an outcome to
				be "good" or "bad" is highly subjective, with athletes primarily focusing
				on post-treatment performance, rather than long-term quality of life [4].
				However, it is undebatable that invasive surgery obviously comes with 
				a larger set of complications, such as possibility of infection, longer
				recovery time, potential failure and need to reoperate, etc. Bouyer et al.
				showed a success rate of 30/38 climbers who were able to return to or improve
				their previous climbing level after surgery. Schneeberger and Schweizer: 38/47
				without surgery. One of the main concerns with pulley reconstruction is 
				that it is usually done with methods that are not anatomical and can have
				significant side effects.  

				<figure>
					<Image
						src="https://s3.r2dliu.com/assets/articles/pulley/surgery.jpg"
						width="800"
					/>
					<div>
						<figcaption className={cn(styles.caption, styles.wide)}>
							<p>
								Common reconstruction techniques
							</p>
						</figcaption>
					</div>
				</figure>
			</p>	
			<p> 
				The loop technique is one of the most popular and results in great 
				mechanical strength: on a study with a similar torture device as above,
				every finger fractured before the reconstructed pulley failed 
				(citation needed). However, Jakubietz et al notes that looping
				techniques are somewhat heavy handed, interfering with gliding motion
				and potentially causing tendon adhesions. They also disagree with many
				of the other techniques, and discard the idea of primary repair given 
				its instability. They perform a novel technique, with a different tendon
				graft, and attempt to basically replicate as close as possible the original
				pulley shape, material, and nature. 
				<figure>
					<Image
						src="https://s3.r2dliu.com/assets/articles/pulley/jakubietz.jpg"
						width="800"
					/>
					<div>
						<figcaption className={cn(styles.caption, styles.wide)}>
							<p>
								Jakubietz et al. novel graft and reconstruction
							</p>
						</figcaption>
					</div>
				</figure>
			</p>
			<p>
				Jakubietz et al. reports 0 mm tendon distance after surgery and throughout
				the years of recovery, a marked case study success. Unfortunately, no
				surgeon I found was willing to perform any procedure for just a single 
				torn A4 pulley, much less a new one from 2017 reported in a case study. 
				The original authors themselves live in Germany, so a bit out of luck there.
				Currently, I have no plans to get surgery and am continuing with conservative
				treatment and rehab.
			</p>
			<h1 id="timeline">Timeline</h1>
			<p>
				I might make this pretty in future but this article was more work than expected.
				Fancy CSS timeline scrolling animation in future.
				<ul>
					<li>
						November 19th, 2021 - Pulley rupture. Swelling, but
						little to no pain. Tingling, numbness, and horrible weakness. 
						Large loss of range of motion: could not make fist, finger hovered
						around an inch away from palm.
					</li>
					<li>
						November 21st, 2021 - Obtained NiceClimbs pulley rings
					</li>
					<li>
						November 25th, 2021 - Saw hand surgeon, and obtained MRI.
						Unfortunately, imaging was done with 3T machine and quality
						was poor. Radiologist completely missed the pulley rupture,
						surgeon was more confident but was not fully conclusive.
					</li>
					<li>
						November 29th, 2021 - Rested and immobilized over Thanksgiving.
						Began super light (feet on floor, gently stressing fingers) 
						hangboarding. Could do a few pullups, though that didn't impact finger 
						much. Started wearing the SPOrt™ while exercising for comfort. 	
					</li>
					<li>
						November 30th, 2021 - Started rehab exercises, and began easing
						back into powerlifting. Heavy deadlifts are extremely difficult to hold.
					</li>
					<li>
						December 2nd, 2021 - Started BFR training. Continued to do 3-4
						times a week. Very light climbing (V0 - juggy V4s)
					</li>
					<li>
						December 13, 2021 - Finger began feeling stiff and achy. 
						Range of motion has increased, almost to fist. Still missing
						about 40 degrees ROM total. Powerlifts are back to working weights
					</li>
					<li>
						December 15, 2021 - Added on Eva Lopez Max Weighted Hangs. 
						Working weight is 20 extra pounds + bodyweight = 155 lbs total on
						14 mm edge for 10 seconds. Without extra weight, can hold body
						weight on 10 mm edge for 10 seconds. Did not have a pre-injury 
						depth to compare to, but hazarding a guess at around 7-8 mm. 
					</li>
					<li>
						December 16, 2021 - Got a full dynamic ultrasound, and confirmed 
						full rupture. 3.1 mm tendon distance at rest, 3.8 mm distance in flexion.
						Not great, especially after already a month of recovery.
					</li>
					<li>
						December 20, 2021 - Moved up 5 lbs on Eva Lopez. Light climbing
						becoming easier. Able to grab some harder holds, but immediate pressure
						felt in finger. Playing it very careful and slow.
					</li>
					<li>
						January 3, 2022 - Purchased a crane scale in order to more accurately
						track finger strength. Numbers soon. Much greater stability in finger.
						Crimp position still causes significant strain/pressure.
					</li>
					<li>
						January 5, 2022 - 73.2 lbs on injured right hand on 14mm edge. 149 on left.
					</li>
					<li>
						January 31, 2022 - 98.2 lbs on injured right hand on 14mm edges
					</li>
					<li>
						February 11, 2022 - Ended Eva Lopez. Strength rose steadily 
						throughout this time. Ended on 35 extra lbs + bodyweight on a 10mm edge.
						Working strength around V7, V8ish. Small crimps still painful, 
						especially if they involve more dynamic movement
					</li>
				</ul> 
			</p>
			<p>
				Conclusion to come. Currently still healing and rehabbing. Currently around V7-V8
				climbing level. If you have any questions, comments, or suggestions, please feel
				free to reach out to me on
				on{" "}
					<a
						href="https://twitter.com/R2_DLiu"
						target="_blank"
						rel="noreferrer"
					>
						Twitter.
					</a>{" "} 
				Thanks for reading if you've made it down this far!
			</p>
			<h1 id="references">References</h1>
			<p>
				1. Behringer M, Willberg C. Application of Blood Flow Restriction to Optimize 
				Exercise Countermeasures for Human Space Flight 
				[published correction appears in Front Physiol. 2019 Mar 26;10:276]. 
				Front Physiol. 2019;10:33. Published 2019 Jan 25. doi:10.3389/fphys.2019.00033
			</p>
			<p> 
				2. Bouyer M, Forli A, Semere A, Chedal Bornu BJ, Corcella D, Moutet F.
				Recovery of rock climbing performance after surgical 
				reconstruction of finger pulleys. Journal of Hand Surgery (European Volume). 
				2016;41(4):406-412. doi:10.1177/1753193415623914
			</p>
			<p>
				3. Crowley TP. The flexor tendon pulley system and rock climbing. 
				J Hand Microsurg. 2012;4(1):25-9.
			</p>
			<p>
				4. El-Sheikh Y, Wong I, Farrokhyar F, and Thoma A. Can J Plast Surg. 
				2006 Winter; 14(4): 227–231. PMCID: PMC2686056 
				Diagnosis of finger flexor pulley injury in rock climbers: A systematic review.
			</p>
			<p>
				5. Hwang PS, Willoughby DS. Mechanisms behind
				blood flow-restricted training and its effect toward
				muscle growth. J Strength Cond Res.
				2019;Suppl1:S167-S179. doi:10.1519/jsc.00000000000
				02384
			</p>
			<p> 6. Jakubietz MG, Meffert RH, Schmidt K, Gruenert JG, Jakubietz RG. 
				Acute A4 Pulley Reconstruction with a First Extensor Compartment Onlay Graft. 
				Plast Reconstr Surg Glob Open. 2017;5(6):e1361. 
				Published 2017 Jun 28. doi:10.1097/GOX.0000000000001361
			</p>
			<p>
				7. Marco, R. A. W., Sharkey, N. A., Smith, T. A., Zissmos, A. G. (1998) 
				Pathomechanics of closed rupture of the finger flexor 
				tendon pulleys in rock climbers. 
				Journal of Bone and Joint Surgery. 80A: 1012-1019
			</p>
			<p>
				8. Schneeberger M, Schweizer A. Pulley Ruptures in Rock Climbers:
				Outcome of Conservative Treatment With the Pulley-Protection 
				Splint-A Series of 47 Cases. Wilderness Environ Med. 2016;27(2):211-218. 
				doi:10.1016/j.wem.2015.12.017.
			</p>
			<p>
				9. Schöffl VR, Schöffl I. Injuries to the Finger Flexor 
				Pulley System in Rock Climbers: Current Concepts. 
				J Hand Surg Am. 2006;31(4):647-654. doi:10.1016/j.jhsa.2006.02.011.
			</p>
			
			<p>
				<i>Last edited January 3rd, 2022</i>
			</p>
		</Fragment>
	);
	return (
		<Fragment>
			<Breakpoint
				className={cn(
					"scrollContainer",
					styles.Pulley,
					styles.mobile
				)}
				xs={true}
				only={true}
			>
				{articleBody}
			</Breakpoint>
			<Breakpoint
				className={cn("scrollContainer", styles.Pulley)}
				s={true}
				up={true}
			>
				{articleBody}
			</Breakpoint>``
		</Fragment>
	);
}

export default Pulley;
