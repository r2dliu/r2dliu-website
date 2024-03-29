import { Divider, useMediaQuery, Button } from "@mui/material";
import { useLocation } from "@remix-run/react";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { type PropsWithChildren, useEffect, useState } from "react";

import Menu from "~/components/Menu";
import { tabletQuery } from "~/helpers/breakpoints";

import styles from "./CanvasPage.module.css";

export default function CanvasPage(props: PropsWithChildren<unknown>) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const isTablet = useMediaQuery(tabletQuery);
  const location = useLocation();
  useEffect(() => {
    setMenuOpen(false);
  }, [location, isTablet]);

  return (
    <div className={styles.CanvasPage}>
      {!isTablet ? (
        <>
          <Menu />
          <AnimatePresence>
            <motion.div
              className={styles.motion}
              initial={{ height: "calc(0% + 0px)" }}
              animate={{ height: "calc(100% - 36px)" }}
              transition={{ duration: 0.4, ease: "easeIn", delay: 0.15 }}
            >
              <Divider className={styles.divider} orientation="vertical" />
            </motion.div>
          </AnimatePresence>
        </>
      ) : null}
      {isTablet ? (
        <div className={styles.navbar}>
          <Button
            className={cn(styles.hamburger, styles.hamburgerSlider, {
              [styles.isActive]: isMenuOpen,
            })}
            onClick={() => {
              setMenuOpen(!isMenuOpen);
            }}
          >
            <span className={styles.hamburgerBox}>
              <span className={styles.hamburgerInner} />
            </span>
          </Button>
          {isMenuOpen ? <Menu /> : null}
        </div>
      ) : null}
      <div
        className={cn(styles.canvas, {
          [styles.blur]: isMenuOpen,
        })}
      >
        {props.children}
      </div>
    </div>
  );
}
