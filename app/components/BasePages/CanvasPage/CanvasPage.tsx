import { PropsWithChildren, useState } from "react";
import cn from "classnames";
import Menu from "~/components/Menu";
import { Divider, useMediaQuery, Button } from "@mui/material";

import { tabletQuery } from "helpers/breakpoints";
import styles from "./CanvasPage.module.css";

export default function CanvasPage(props: PropsWithChildren<unknown>) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const isTablet = useMediaQuery(tabletQuery);

  return (
    <div className={styles.CanvasPage}>
      {!isTablet && (
        <>
          <Menu />
          <Divider className={styles.divider} orientation="vertical" />
        </>
      )}
      {isTablet && (
        <div className={styles.navbar}>
          <Button
            className={cn(styles.hamburger, styles.hamburgerSlider, {
              [styles.isActive]: isMenuOpen,
            })}
            onClick={(_) => {
              setMenuOpen(!isMenuOpen);
            }}
          >
            <span className={styles.hamburgerBox}>
              <span className={styles.hamburgerInner} />
            </span>
          </Button>
          {isMenuOpen && <Menu />}
        </div>
      )}
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
