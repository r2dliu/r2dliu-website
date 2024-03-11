import { useMediaQuery } from "@mui/material";
import { useLocation, useOutlet } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";

import CanvasPage from "~/components/BasePages/CanvasPage";
import { tabletQuery } from "~/helpers/breakpoints";

import styles from "./canvas.module.css";

export default function Canvas() {
  const outlet = useOutlet();
  const isTablet = useMediaQuery(tabletQuery);
  return (
    <CanvasPage>
      <AnimatePresence mode="wait">
        <motion.div
          className={styles.motion}
          key={useLocation().pathname}
          initial={{ y: "-5px", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          exit={{
            y: "5px",
            opacity: 0,
            transition: {
              duration: isTablet ? "0" : "0.15",
              ease: "easeOut",
            },
          }}
          transition={{ duration: "0.15", ease: "easeIn" }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </CanvasPage>
  );
}
