import pkg from "react-lazy-load-image-component";
import cn from "classnames";
// import ReactPlayer from "react-player/youtube";
import styles from "./Melee.module.css";
const { LazyLoadImage } = pkg;

export default function Melee() {
  return (
    <div className={styles.Melee}>
      <div className={styles.details}>{"Super Smash Bros. Melee • Fox"}</div>
      <div className={styles.name}>{"EGTV. R2DLiu"}</div>
      <div className={styles.bio1}>
        After picking up the game competitively back in late 2014, David
        “R2DLiu” Liu quickly rose to prominence, consolidating a spot as a top
        player within the greater Philadelphia region. In October 2016, with a
        slew of top 100 wins under his belt, he achieved his best result yet at
        the Big House 6: an incredible upset over a perennial top 10 player, the
        indomitable Pikachu master{" "}
        <a href={"https://en.wikipedia.org/wiki/Axe_(gamer)"}>Axe</a>.
        <LazyLoadImage
          wrapperClassName={styles.fox}
          className={styles.image}
          alt={
            "Picture of Fox from Super Smash Bros. Melee performing a down-aerial"
          }
          effect="blur"
          src={"https://s3.r2dliu.com/assets/fox_drill.png"}
          placeholderSrc={"https://s3.r2dliu.com/assets/fox_drill_small.png"}
        />
      </div>

      <div className={styles.bio2}>
        Since then, R2DLiu has continued to compete on and off throughout the
        years, fading slowly into inactivity, but continuing to remain a threat
        in bracket at majors. Most recently, he achieved a top 64 finish at
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
        <a className={styles.url} href={"https://twitter.com/_lilchen"}>
          @_lilchen
        </a>
      </div>

      <div className={styles.header}>{"Achievements"}</div>
      <div className={styles.achievements}>
        <div className={styles.achievement}>
          <div className={styles.tournament}>The Big House 6</div>
          <div className={styles.placement}>
            <div className={styles.text}>
              <span className={styles.number}>33</span>
              <span className={styles.suffix}>rd</span>
            </div>
            <div className={styles.circle}>
              <div className={styles.arc}></div>
            </div>
            <div className={styles.circle}>
              <div className={cn(styles.arc, styles.second)}></div>
            </div>
          </div>
          <div className={styles.total}>
            <span className={styles.text}>out of </span>
            <span>1564</span>
          </div>
        </div>
        <div className={styles.achievement}>
          <div className={styles.tournament}>Genesis 4</div>
          <div className={styles.placement}>
            <div className={styles.text}>
              <span className={styles.number}>49</span>
              <span className={styles.suffix}>th</span>
            </div>
            <div className={styles.circle}>
              <div className={styles.arc}></div>
            </div>
            <div className={styles.circle}>
              <div className={cn(styles.arc, styles.second)}></div>
            </div>
          </div>
          <div className={styles.total}>
            <span className={styles.text}>out of </span>
            <span>1704</span>
          </div>
        </div>
        <div className={styles.achievement}>
          <div className={styles.tournament}>Genesis 9</div>
          <div className={styles.placement}>
            <div className={styles.text}>
              <span className={styles.number}>49</span>
              <span className={styles.suffix}>th</span>
            </div>
            <div className={styles.circle}>
              <div className={styles.arc}></div>
            </div>
            <div className={styles.circle}>
              <div className={cn(styles.arc, styles.second)}></div>
            </div>
          </div>
          <div className={styles.total}>
            <span className={styles.text}>out of </span>
            <span>1251</span>
          </div>
        </div>
      </div>
      <div className={styles.header}>{"Gameplay"}</div>
      <div className={styles.matches}>
        {/* <ReactPlayer
          className={styles.video}
          width={300}
          height={200}
          controls={true}
          url="https://www.youtube.com/watch?v=IbImG0x4hD4"
        />
        <ReactPlayer
          className={styles.video}
          width={300}
          height={200}
          controls={true}
          url="https://www.youtube.com/watch?v=q_qxSYaAk7w"
        />
        <ReactPlayer
          className={styles.video}
          width={300}
          height={200}
          controls={true}
          url="https://www.youtube.com/watch?v=Nc8gFTz2irw"
        /> */}
      </div>
    </div>
  );
}
