import { Divider } from "@mui/material";

import styles from "./article.module.css";

export default function Articles() {
  return (
    <div className={styles.Article}>
      <div className={styles.title}>Title</div>
      <Divider className={styles.divider} />
    </div>
  );
}
