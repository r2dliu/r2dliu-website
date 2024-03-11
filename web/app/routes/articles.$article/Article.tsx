import { Divider } from "@mui/material";
import { Link, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import tocbot from "tocbot";

import styles from "./Article.module.css";
import type { loader } from "./route";

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

  useEffect(() => {
    tocbot.init({
      // Where to render the table of contents.
      tocSelector: ".toc",
      // Where to grab the headings to build the table of contents.
      contentSelector: ".article",
      // Which headings to grab inside of the contentSelector element.
      headingSelector: "h1, h2",
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
      scrollContainer: `.${styles.markdown}`,
      onClick: async () => {
        // Minor hack to fix active link highlighting
        await new Promise((r) => setTimeout(r, 50));
        // @ts-expect-error tocbot has options
        tocbot.refresh({ ...tocbot.options });
      },
      headingsOffset: 90,
    });
  }, []);

  return (
    <div className={styles.Article}>
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
                <h1 id={generateSlug(props.children as string)} {...props}></h1>
              ),
              h2: ({ node, ...props }) => (
                <h2 id={generateSlug(props.children as string)} {...props}></h2>
              ),
              img: ({ node, ...props }) => (
                // @ts-ignore
                <LazyLoadImage effect="blur" {...props} />
              ),
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {data.markdown}
          </ReactMarkdown>
        </div>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.inner}>
          <div className="toc"></div>
        </div>
        <Link to="/articles" className={styles.return}>
          <div className={styles.container}>
            <div className={styles.text}>← Back to Articles</div>
            <div className={styles.highlight} />
          </div>
        </Link>
      </div>
    </div>
  );
}
