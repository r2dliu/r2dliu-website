import { LazyLoadImage } from "react-lazy-load-image-component";

import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.About}>
      <div className={styles.title}>
        {"I'm David, a full-stack software engineer."}
        <div className={styles.description}>
          <p>
            {
              "I’m also a climber, hacker, Melee player, coach, fashion enthusiast, and much more.\n\n"
            }
          </p>
          <p>
            {
              "I’m obsessed with the concept of self improvement and pushing the limits of what I’m capable of. In the process, I’ve grown into a passionate, disciplined, and process-oriented architect who sees work and play as two sides of the same coin."
            }
          </p>
          <p>
            {
              "This site is currently having a bit of an identity crisis: it’s simultaneously a passion project, a testbed, a portfolio, and a conglomerate of various types of content. This is also the third time I've rebuilt it from scratch. That being said, it is my website, so I think it’s okay if it grows into a bit of a hodgepodge collection of my many interests."
            }
          </p>
          <p>{"Thanks for visiting and checking out my site!"}</p>
        </div>
      </div>

      <LazyLoadImage
        wrapperClassName={styles.wrapper}
        className={styles.image}
        alt={"Picture of David in a background filled with neon lights"}
        effect="opacity"
        src={"https://s3.r2dliu.com/assets/about.jpg"}
        placeholderSrc={"https://s3.r2dliu.com/assets/about_small.jpg"}
      />
      <div className={styles.credit}>
        Photo by Bekah Wong |{" "}
        <a className={styles.url} href={"https://twitter.com/alonelychime"}>
          @alonelychime
        </a>
      </div>
    </div>
  );
}
