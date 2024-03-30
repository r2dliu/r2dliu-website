import { Link } from "@remix-run/react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import styles from "./Climbing.module.css";

export default function Climbing() {
  return (
    <div className={styles.Climbing}>
      <div className={styles.quote}>
        {'"You will always find an appropriate opponent in the rocks."'}
      </div>
      <div className={styles.attribution}>{'— Tomáš "TOMAJDA" Sobotka'}</div>
      <LazyLoadImage
        wrapperClassName={styles.wrapper}
        className={styles.image}
        alt={"Picture of David climbing at an indoor competition"}
        effect="blur"
        src={"https://s3.r2dliu.com/assets/climbing.jpg"}
        placeholderSrc={"https://s3.r2dliu.com/assets/climbing_small.jpg"}
      />
      <div className={styles.bio}>
        I discovered rock climbing as a hobby late into my college years, and
        I’ve been hooked ever since. Recently, I’ve started to compete, train,
        and generally take climbing much more seriously. I currently boulder
        around V10 relatively consistently. Follow me on Instagram for climbing
        content!
      </div>
      <div className={styles.header}>Personal Training & Coaching</div>
      <div className={styles.bio}>
        I am an{" "}
        <a href={"https://www.acsm.org/"} target={"_blank"} rel="noreferrer">
          ACSM
        </a>{" "}
        Certified Personal Trainer® (ACSM-CPT) who works at{" "}
        <a
          href="https://movementgyms.com/columbia/"
          target={"_blank"}
          rel="noreferrer"
        >
          Movement Columbia
        </a>
        . Check out my free <Link to="classes">classes</Link>! I love teaching
        in general and have an extensive history of tutoring and coaching in
        various subjects, including academia, Melee, and of course health and
        fitness. I primarily work with climbing athletes to improve their
        performance, but am happy to help any motivated individual meet their
        specific goals! Email me or message me on{" "}
        <a
          href={"https://www.instagram.com/r2dliu/"}
          target={"_blank"}
          rel="noreferrer"
        >
          Instagram
        </a>{" "}
        for information on rates and availability! I work with both remote and
        in-person clients.
      </div>
      <div className={styles.header}>Tick List</div>
      <div className={styles.bio}>Soon&trade;</div>
    </div>
  );
}
