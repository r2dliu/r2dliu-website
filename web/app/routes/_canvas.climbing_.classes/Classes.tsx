import { gql, useQuery } from "@apollo/client";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button, Divider } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoaderData } from "@remix-run/react";
import cn from "classnames";
import keyBy from "lodash.keyby";
import moment from "moment-timezone";
import { Fragment } from "react";
// eslint-disable-next-line import/order
import Markdown from "react-markdown";

import { ClassType, ClassTypeEdge } from "src/__generated__/graphql";

import styles from "./Classes.module.css";
import { loader } from "./route";

export default function Classes() {
  const timestamp = useLoaderData<typeof loader>();
  const classesQuery = gql`
  {
    classes(startTime_Gte: "${timestamp}") {
      edges {
        node {
          id
          startTime
          description
          endTime
          location
          url
          course {
            id
            name
            description
          }
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
  const { loading, error, data } = useQuery(classesQuery);

  if (loading) {
    return (
      <div className={cn(styles.Classes, styles.loading)}>
        <CircularProgress className={styles.icon} />
      </div>
    );
  }

  const classesById: Record<string, ClassType> = keyBy(
    data?.classes?.edges.map((edge: ClassTypeEdge) => edge.node),
    "id",
  );

  return (
    <div className={styles.Classes}>
      {error ? (
        <div>Something went wrong: check back later!</div>
      ) : (
        <>
          <div className={styles.header}>Upcoming Classes</div>
          <div className={styles.wrapper}>
            <div className={styles.classList}>
              {Object.values(classesById).map((instance: ClassType) => {
                const startTime = moment.utc(instance.startTime);
                const endTime = moment.utc(instance.endTime);
                return (
                  <Fragment key={instance.id}>
                    <Accordion disableGutters className={styles.accordion}>
                      <AccordionSummary>
                        <div className={styles.date}>
                          <div className={styles.day}>
                            {startTime.tz("America/New_York").format("DD")}
                          </div>
                          <div className={styles.month}>
                            {startTime.tz("America/New_York").format("MMM")}
                          </div>
                        </div>
                        <div className={styles.content}>
                          <div className={styles.title}>
                            {instance.course?.name}
                          </div>
                          <div className={styles.details}>
                            {`${startTime
                              .tz("America/New_York")
                              .format("hh:mm A")} - ${endTime
                              .tz("America/New_York")
                              .format("hh:mm A")} • ${instance.location}`}
                          </div>
                        </div>
                        <div className={styles.icon}>
                          <ArrowForwardIosIcon />
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className={styles.drawer}>
                          <Markdown>{instance.description}</Markdown>
                          <Button
                            className={styles.button}
                            onClick={() => window.open(instance.url, "_blank")}
                          >
                            Register
                          </Button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Divider className={styles.divider} />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
