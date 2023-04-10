import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useOutlet,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { createHead } from "remix-island";

import "react-lazy-load-image-component/src/effects/opacity.css";
import styles from "styles/index.css";
import NotFoundPage from "./components/BasePages/NotFoundPage";

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

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
));

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <NotFoundPage />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const outlet = useOutlet();
  const getKey = () => {
    const path = useLocation().pathname;
    const splitPath = useLocation().pathname.split("/");
    if (splitPath.length === 2 && splitPath[1] !== "") {
      return "main";
    } else {
      return path;
    }
  };

  return (
    <>
      {/* <html lang="en"> */}
      <Head />
      {/* <body> */}
      {/* <Outlet /> */}
      <AnimatePresence mode="wait">
        <motion.main
          key={getKey()}
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
      {/* </body> */}
      {/* </html> */}
    </>
  );
}
