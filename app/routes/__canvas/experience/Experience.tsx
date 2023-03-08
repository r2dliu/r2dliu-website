import { Divider } from "@mui/material";
import { Link } from "@remix-run/react";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CanvasPage from "~/components/BasePages/CanvasPage";

import styles from "./Experience.module.css";

type entriesType = {
  [key: string]: {
    name: string;
    title: string;
    range: string;
    description: ReactNode[];
  };
};

export default function Experience() {
  const entries: entriesType = {
    "JHU/APL": {
      name: "Johns Hopkins University Applied Physics Laboratory",
      title: "Software Architect",
      range: "2019 — Present",
      description: [
        <br />,
        "At APL, I worked primarily as a software architect, while also taking on the roles of a full stack dev, team lead, mentor, and project manager.",
        <br />,
        <br />,
        "I was the foremost software developer on a Joint Artificial Intelligence Center (JAIC)/Chief Digital and Artificial Intelligence Office (CDAO) project called Smart Sensor. This awarded a hefty contract ranging well into the eight-figure rnage to enable the operation of autonomous unmanned aerial vehicles. The project involved real-time sensor processing and data fusion, including electrooptical, passive electronic sensing, and synthetic aperture radar. I managed a core team of 10-20 developers and served as the primary engineering point of contact for the other teams such as algorithm developers and AI/ML researchers, totalling more than 100 people, integrating their work into the final product. I specced hardware, implemented algorithms, deployed machine learning models, built microservices, managed unit tests and CI/CD flows, and wrote lots and lots of code.",
        <br />,
        <br />,
        "I was also a core full-stack developer on a multimillion dollar project called ORCA, or the Office of Naval Intelligence (ONI) Repository of Characterized Adversaries. This involved transitioning a large body of hierarchical data such that it could be securely accessible from the cloud via a modernized web app. Much of the difficulty of this lay in the complexity and sensitivity of the data and desire to enable actions such as search, filter, manage permissions, detect anomalies, etc.",
      ],
    },
    "Start.gg": {
      name: "Start.gg",
      title: "Software Engineer",
      range: "2018 — 2019",
      description: ["some stuff"],
    },
    "Johns Hopkins University": {
      name: "Johns Hopkins University",
      title: "M.S. in Computer Science",
      range: "2019 — Present",
      description: ["some stuff"],
    },
    "Swarthmore College": {
      name: "Swarthmore College",
      title: "B.S. in Computer Science",
      range: "2014 — 2018",
      description: ["some stuff"],
    },
  };

  const [activeEntry, setActiveEntry] = useState("JHU/APL");

  return (
    <div className={styles.Experience}>
      <div className={styles.work}>
        <div className={styles.header}>{"Work & Experience"}</div>
        <Divider className={styles.timeline} orientation="vertical" />
        <div className={styles.content}>
          <div className={styles.entries}>
            {Object.keys(entries).map((entry) => (
              <div
                key={entry}
                className={cn(styles.entry, {
                  [styles.active]: entry === activeEntry,
                })}
                onClick={() => {
                  setActiveEntry(entry);
                }}
              >
                <div
                  className={cn(styles.diamond, {
                    [styles.active]: entry === activeEntry,
                  })}
                />
                <div className={styles.name}>{entry}</div>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEntry}
              className={styles.details}
              initial={{ y: "-5px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{
                y: "5px",
                opacity: 0,
                transition: {
                  duration: "0.15",
                  ease: "easeOut",
                },
              }}
              transition={{ duration: "0.15", ease: "easeIn" }}
            >
              <div className={styles.name}>{entries[activeEntry].name}</div>
              <div className={styles.title}>{entries[activeEntry].title}</div>
              <div className={styles.range}>{entries[activeEntry].range}</div>
              <div className={styles.description}>
                {entries[activeEntry].description}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.skills}>
        <div className={styles.header}>{"Skills"}</div>
      </div>
    </div>
  );
}
