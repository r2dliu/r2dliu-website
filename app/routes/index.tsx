import { Button } from "@mui/material";
import { useNavigate } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import cn from "classnames";
import { AnimationEventHandler, useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Index() {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.Home}>
      <Button
        onTransitionEnd={(e) => {
          if (e.propertyName === "width" && e.pseudoElement === "::before") {
            navigate("/about");
          }
        }}
        className={cn(styles.button, {
          [styles.clicked]: isClicked,
        })}
        variant="outlined"
        color="primary"
        onClick={() => {
          setIsClicked(true);
        }}
      >
        Explore
      </Button>
    </div>
  );
}
