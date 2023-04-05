import cn from "classnames";
import { Link, useMatches } from "@remix-run/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import styles from "./Menu.module.css";

export default function Menu() {
  const matches = useMatches();
  const currPage = matches[2]?.pathname.substring(1);

  const pages = {
    about: "About Me",
    experience: "Experience",
    articles: "Articles",
    melee: "Melee",
    climbing: "Climbing",
  };

  return (
    <div className={styles.Menu}>
      <Link className={styles.home} to={"/"}>
        <LazyLoadImage
          className={styles.logo}
          alt={"Square seal script logo for this website"}
          effect="blur"
          src={"https://s3.r2dliu.com/assets/logo.png"}
          placeholderSrc={"https://s3.r2dliu.com/assets/logo_small.png"}
        />
      </Link>
      <div className={styles.links}>
        {Object.entries(pages).map(([key, page]) => {
          const isActive = key === currPage;
          return (
            <div key={key} className={styles.linkContainer}>
              {isActive && <PlayArrowIcon className={styles.icon} />}
              <Link
                to={`/${key}`}
                className={cn(styles.link, {
                  [styles.active]: page === currPage,
                })}
              >
                {page}
              </Link>
            </div>
          );
        })}
        <div className={styles.linkContainer}>
          <a
            href={"https://s3.r2dliu.com/assets/resume.pdf"}
            className={styles.link}
          >
            Resume
          </a>
        </div>
      </div>
      <div className={styles.icons}>
        <a
          className={styles.link}
          href={"https://www.linkedin.com/in/r2dliu/"}
          target={"_blank"}
        >
          <LinkedInIcon className={styles.icon} />
        </a>
        <a
          className={styles.link}
          href={"https://instagram.com/r2dliu"}
          target={"_blank"}
        >
          <InstagramIcon className={styles.icon} />
        </a>
        <a className={styles.link} href={"mailto:zliu3301@gmail.com"}>
          <EmailIcon className={styles.icon} />
        </a>
        <a
          className={styles.link}
          href={"https://twitter.com/r2_dliu"}
          target={"_blank"}
        >
          <TwitterIcon className={styles.icon} />
        </a>
      </div>
    </div>
  );
}