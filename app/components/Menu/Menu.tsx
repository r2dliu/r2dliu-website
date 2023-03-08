import cn from "classnames";
import { Link, useMatches } from "@remix-run/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import styles from "./Menu.module.css";

export default function Menu() {
  const matches = useMatches();
  const currPage = matches[2].pathname.substring(1);

  const pages = {
    about: "About Me",
    experience: "Experience",
    articles: "Articles",
    melee: "Melee",
    climbing: "Climbing",
    resume: "Resume",
  };

  return (
    <div className={styles.Menu}>
      <Link to={"/"}>
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
      </div>
    </div>
  );
}
