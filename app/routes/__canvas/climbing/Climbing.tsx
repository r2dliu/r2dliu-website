import { Link } from "@remix-run/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import cn from "classnames";
import ReactPlayer from "react-player/youtube";

import styles from "./Climbing.module.css";
import { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Climbing" },
    {
      property: "og:title",
      content: "Climbing",
    },
  ];
};

export default function Climbing() {
  return (
    <div className={styles.Climbing}>
      <div className={styles.quote}>
        {'"You will always find an appropriate opponent in the rocks."'}
      </div>
      <div className={styles.attribution}>— Tomáš "TOMAJDA" Sobotka</div>
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
        I love teaching and have an extensive history of tutoring and coaching
        in various subjects, including academia and Melee. Most recently, I've
        been working towards an{" "}
        <a href={"https://www.acsm.org/"} target={"_blank"}>
          ACSM
        </a>{" "}
        personal training certification, and working with a handful of climbing
        athletes to improve their performance. Email me or message me on{" "}
        <a href={"https://www.instagram.com/r2dliu/"} target={"_blank"}>
          Instagram
        </a>{" "}
        for information on rates and availability! Happy to work with both
        remote and in-person clients.
      </div>
      <div className={styles.header}>Tick List</div>
      <div className={styles.bio}>Soon&trade;</div>
    </div>
  );
}
