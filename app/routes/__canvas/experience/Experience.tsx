import { Divider } from "@mui/material";
import type { V2_MetaFunction } from "@remix-run/node";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useState } from "react";

import styles from "./Experience.module.css";

type entriesType = {
  [key: string]: {
    name: string;
    title: string;
    range: string;
    description: ReactNode[];
  };
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Experience" },
    {
      property: "og:title",
      content: "Experience",
    },
  ];
};

export default function Experience() {
  const entries: entriesType = {
    "JHU/APL": {
      name: "JHU Applied Physics Laboratory",
      title: "Software Architect",
      range: "2019 — Present",
      description: [
        <br key={1} />,
        "At ",
        <a
          key={"link"}
          href="https://www.jhuapl.edu/"
          target="_blank"
          rel="noreferrer"
        >
          APL
        </a>,
        ", I worked primarily as a software architect, while also taking on the roles of a full stack dev, team lead, mentor, and project manager.",
        <br key={2} />,
        <br key={3} />,
        "I was the foremost software developer on a Joint Artificial Intelligence Center (JAIC)/Chief Digital and Artificial Intelligence Office (CDAO) project called Smart Sensor. This awarded a hefty contract ranging well into the eight-figure range to enable the operation of autonomous unmanned aerial vehicles. The project involved real-time sensor processing and data fusion (electro-optical/infrared systems, passive electronic sensing, synthetic aperture radar, etc.). I managed a core team of 10-20 developers and served as the primary engineering point of contact for the other teams such as algorithm developers and AI/ML researchers, totalling more than 100 people. I integrated their work into the final product, implemented algorithms, deployed machine learning models, specced hardware, built microservices, managed unit tests and CI/CD flows, and wrote lots and lots of code.",
        <br key={4} />,
        <br key={5} />,
        "I was also a core full-stack developer on a multimillion dollar project called ORCA, or the Office of Naval Intelligence (ONI) Repository of Characterized Adversaries. This involved transitioning a large body of hierarchical data such that it could be securely accessible from the cloud via a modernized web app. Much of the difficulty of this lay in the complexity and sensitivity of the data and desire to enable actions such as search, filter, manage permissions, detect anomalies, etc.",
      ],
    },
    "Start.gg": {
      name: "Start.gg",
      title: "Software Engineer",
      range: "2018 — 2019",
      description: [
        <br key={1} />,
        "I worked as a full-stack software engineer at ",
        <a
          key={"link"}
          href="https://start.gg/"
          target="_blank"
          rel="noreferrer"
        >
          Start.gg
        </a>,
        ", formerly known as Smash.gg prior to its acquisition by Microsoft. Start.gg is a esports platform designed to support and facilitate esports events. This focuses particularly on capabilities revolving around competition, such as constructing tournament brackets, reporting live results, alerting users of matches, providing admin and moderation tools, managing series and leagues, and driving the growth of passionate organizers around the world.",
        <br key={2} />,
        <br key={3} />,
        "During my time as part of a small, fast-paced team, I wore many hats, working on nearly every aspect of the codebase. I designed features, wrote both frontend and backend code, managed databases, supported DevOps, and interfaced with partners such as Twitch and Microsoft on a variety of projects.",
      ],
    },
    "Johns Hopkins University": {
      name: "Johns Hopkins University",
      title: "M.S. in Computer Science",
      range: "2019 — Present",
      description: [
        <br key={1} />,
        "Expected graduation in 2023, with 6 required credits (2 classes) remaining. Most of this progress was done while working full time at APL.",
      ],
    },
    "Swarthmore College": {
      name: "Swarthmore College",
      title: "B.S. in Computer Science",
      range: "2014 — 2018",
      description: [<br key={1} />, "Additional minor in mathematics."],
    },
  };

  const [activeEntry, setActiveEntry] = useState("JHU/APL");

  return (
    <div className={styles.Experience}>
      <div className={styles.work}>
        <div className={styles.header}>{"Work & Experience"}</div>
        <div className={styles.content}>
          <Divider className={styles.timeline} orientation="vertical" />
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
        <div className={styles.header}>{"Skills & Languages"}</div>
        <div className={styles.content}>
          <div className={styles.column}>
            <div className={styles.skill}>{"C++ (mostly 17, 20)"}</div>
            <div className={styles.skill}>{"Javascript (mostly ES6+)"}</div>
            <div className={styles.skill}>{"Rust"}</div>
            <div className={styles.skill}>{"Python"}</div>
            <div className={styles.skill}>{"C"}</div>
            <div className={styles.skill}>{"React"}</div>
          </div>
          <div className={styles.column}>
            <div className={styles.skill}>{"Linux"}</div>
            <div className={styles.skill}>{"GraphQL"}</div>
            <div className={styles.skill}>{"CI/CD"}</div>
            <div className={styles.skill}>{"Docker"}</div>
            <div className={styles.skill}>{"SQL"}</div>
            <div className={styles.skill}>{"Node"}</div>
          </div>
          <div className={styles.column}>
            <div className={styles.skill}>{"Git"}</div>
            <div className={styles.skill}>{"Pytorch"}</div>
            <div className={styles.skill}>{"Tensorflow"}</div>
            <div className={styles.skill}>{"AWS"}</div>
            <div className={styles.skill}>{"Figma"}</div>
            <div className={styles.skill}>{"Photoshop"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
