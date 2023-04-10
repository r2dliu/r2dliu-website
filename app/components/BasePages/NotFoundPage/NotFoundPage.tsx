import { Button } from "@mui/material";
import { Link } from "@remix-run/react";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.NotFound}>
      <div className={styles.header}>You're not supposed to be here...</div>
      <Link to="/">
        <Button className={styles.button} variant="outlined" color="primary">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
