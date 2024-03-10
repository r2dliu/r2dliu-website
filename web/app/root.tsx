import { useEffect } from "react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useOutlet,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { createHead } from "remix-island";

import "react-lazy-load-image-component/src/effects/opacity.css";
import styles from "styles/index.css";
import * as gtag from "helpers/gtags.client";
import NotFoundPage from "./components/BasePages/NotFoundPage";

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
    { rel: "stylesheet", href: styles },
  ];
};

export const meta: MetaFunction = () => {
  return [
    {
      property: "og:title",
      content: "R2DLiu.com",
    },
  ];
};

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <Meta />
    <Links />
  </>
));

export function CatchBoundary() {
  return (
    <html>
      <head>
        <title>Oops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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

export const loader = async () => {
  return json({ gaTrackingId: process.env.GA_TRACKING_ID });
};

export default function App() {
  const outlet = useOutlet();
  const location = useLocation();
  const { gaTrackingId } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  const getKey = () => {
    const path = location.pathname;
    const splitPath = location.pathname.split("/");
    if (splitPath.length === 2 && splitPath[1] !== "") {
      return "main";
    } else {
      return path;
    }
  };

  return (
    <>
      <Head />
      {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
          />
          <script
            async
            id="gtag-init"
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaTrackingId}', {
                    page_path: window.location.pathname,
                  });
                `,
            }}
          />
        </>
      )}
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
    </>
  );
}
