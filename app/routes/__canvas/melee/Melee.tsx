import { Link } from "@remix-run/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CanvasPage from "~/components/BasePages/CanvasPage";

import styles from "./Melee.module.css";

export default function Melee() {
  return (
    <div className={styles.Melee}>
      <div className={styles.details}>{"Super Smash Bros. Melee • Fox"}</div>
      <div className={styles.name}>{"EGTV. R2DLiu"}</div>
      <div className={styles.bio1}>
        After picking up the game competitively back in late 2014, David
        “R2DLiu” Liu quickly rose to prominence, consolidating a spot as a top
        player within the greater Philadelphia region. In October 2016, with a
        slew of top 100 wins under his belt, he achieved his best result yet: a
        33rd out of 1,563 at the Big House 6, including an incredible upset over
        a perennial top 10 player: the indomitable Pikachu player{" "}
        <a href={"https://en.wikipedia.org/wiki/Axe_(gamer)"}>Axe</a>.
      </div>
      <LazyLoadImage
        wrapperClassName={styles.fox}
        // className={styles.fox}
        alt={
          "Picture of Fox from Super Smash Bros. Melee performing a down-aerial"
        }
        effect="blur"
        src={"https://s3.r2dliu.com/assets/fox_drill.png"}
        placeholderSrc={"https://s3.r2dliu.com/assets/fox_drill_small.png"}
      />
      <div className={styles.bio2}>
        Since then, R2DLiu has continued to compete on and off throughout the
        years, fading slowly into inactivity, but continuing to remain a threat
        in bracket at majors. Most recently, he achieving a top 64 finish at
        Genesis 9 after a nearly three year hiatus. Follow him along on his
        enduring Melee journey on{" "}
        <a href={"https://twitch.tv/r2dliu"}>Twitch</a> and{" "}
        <a href={"https://twitter.com/r2_dliu"}>Twitter</a>.
      </div>

      <LazyLoadImage
        wrapperClassName={styles.wrapper}
        className={styles.image}
        alt={"Picture of David with a Gamecube controller in pocket"}
        effect="blur"
        src={"https://s3.r2dliu.com/assets/melee.jpg"}
        placeholderSrc={"https://s3.r2dliu.com/assets/melee_small.jpg"}
      />
      <div className={styles.credit}>
        Photo by Lilian Chen |{" "}
        <a href={"https://twitter.com/_lilchen"}>@_lilchen</a>
      </div>

      <div className={styles.header}>{"Achievements"}</div>
    </div>
  );
}
