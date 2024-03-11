import { Button } from "@mui/material";
import { useNavigate } from "@remix-run/react";
import cn from "classnames";
import { useState } from "react";

import styles from "./index.module.css";

export default function Index() {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.Home}>
      <div className={styles.name}>David Liu</div>
      <div className={styles.description}>Software | Climbing | Melee</div>
      <Button
        onTransitionEnd={(e) => {
          if (e.propertyName === "width" && e.pseudoElement === "::before") {
            console.log("before navigate");
            navigate("/about");
          }
        }}
        className={cn(styles.button, {
          [styles.clicked]: isClicked,
        })}
        variant="outlined"
        color="primary"
        onClick={() => {
          console.log("wtf");
          setIsClicked(true);
        }}
      >
        Explore
      </Button>
    </div>
  );
}
