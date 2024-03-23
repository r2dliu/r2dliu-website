//  import { LazyLoadImage } from "react-lazy-load-image-component";

// import { Link } from "@remix-run/react";
import { gql, useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularProgress from "@mui/material/CircularProgress";
import cn from "classnames";

import styles from "./Classes.module.css";

const classesQuery = gql`
  {
    classes(startTime_Gte: "2006-01-02T15:04:05") {
      edges {
        node {
          id
          startTime
          endTime
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
export default function Classes() {
  const { loading, error, data } = useQuery(classesQuery);
  console.log(data);
  if (loading) {
    return (
      <div className={cn(styles.Classes, styles.loading)}>
        <CircularProgress className={styles.icon} />
      </div>
    );
  }

  const openDrawer = () => {
    console.log("open drawer");
  };
  return (
    <div className={styles.Classes}>
      <div className={styles.course}>
        {error ? <div>Something went wrong: check back later!</div> : null}
        <button onClick={() => openDrawer()} className={styles.class}>
          <div className={styles.date}>
            <div className={styles.day}>26</div>
            <div className={styles.month}>Mar</div>
          </div>
          <div className={styles.content}>
            <div className={styles.title}>Climbing Training & Workshops</div>
            <div className={styles.details}>
              7:15 EST - 8:15 EST • Movement Columbia
            </div>
          </div>
          <div className={styles.icon}>
            <ArrowForwardIosIcon />
          </div>
        </button>
      </div>
    </div>
  );
}
