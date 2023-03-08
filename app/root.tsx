import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useOutlet,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";

import "react-lazy-load-image-component/src/effects/opacity.css";
import styles from "styles/index.css";

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
    { rel: "stylesheet", href: styles },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "R2DLiu.com",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const outlet = useOutlet();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* <Outlet /> */}
        <AnimatePresence mode="wait">
          <motion.main
            // key={useLocation().pathname}
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
            {outlet}
          </motion.main>
        </AnimatePresence>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
