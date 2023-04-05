import { useRef, useEffect } from "react";
import {
  useParams,
  useLoaderData,
  useRouteLoaderData,
  useLocation,
  Link,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { Divider } from "@mui/material";
import rehypeRaw from "rehype-raw";
import { articleData } from "~/data/articles";

import styles from "./article.module.css";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";

export const loader = async ({ params }: LoaderArgs) => {
  return articleData[params.article as keyof typeof articleData] || null;
};

const generateSlug = (str: string) => {
  str = str?.replace(/^\s+|\s+$/g, "");
  str = str?.toLowerCase();
  const from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    ?.replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return str;
};

export default function Articles() {
  const lastData = useRef({});
  const data = useLoaderData<typeof loader>() || lastData.current;
  useEffect(() => {
    if (data) {
      lastData.current = data;
    }
  }, [data]);

  return (
    <div className={styles.Article}>
      <div className={styles.sidebar}>
        <Link to="/articles">bleh</Link>
      </div>
      <div className={styles.container}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.4, ease: "easeIn", delay: 0.15 }}
        >
          <Divider className={styles.divider} />
        </motion.div>
        <span className={styles.title}>{data.title}</span>
        <div className={styles.markdown}>
          <ReactMarkdown
            className="article"
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  id={generateSlug(props.children[0] as string)}
                  {...props}
                ></h1>
              ),
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {data.markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
