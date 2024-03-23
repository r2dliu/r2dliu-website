import { cssBundleHref } from "@remix-run/css-bundle";
import {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  useOutlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { createHead } from "remix-island";

import "react-lazy-load-image-component/src/effects/opacity.css";
import * as gtag from "~/helpers/gtags.client";
import stylesheet from "~/styles/index.css";

import NotFoundPage from "./components/BasePages/NotFoundPage";

export const meta: MetaFunction = () => {
  return [
    {
      property: "og:title",
      content: "R2DLiu.com",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "icon", href: "/_static/favicon.ico" },
];

export const Head = createHead(() => (
  <>
    <Meta />
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <Links />
  </>
));

export const SafeHead = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </>
));

export function ErrorBoundary() {
  return (
    <html lang="en">
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname, search } = new URL(request.url);

  if (pathname.endsWith("/") && pathname !== "/") {
    // Redirect to the same URL without a trailing slash
    throw redirect(`${pathname.slice(0, -1)}${search}`, 301);
  }

  return json({
    gaTrackingId: process.env.GA_TRACKING_ID,
    ENV: {
      nodeEnv: process.env.NODE_ENV,
      apiUrl: process.env.REACT_APP_API_URL,
    },
  });
};

export default function App() {
  const outlet = useOutlet();
  const location = useLocation();
  const { gaTrackingId, ENV } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  const getKey = () => {
    const path = location.pathname;
    const splitPath = location.pathname.split("/");
    if (splitPath.length >= 2 && splitPath[1] !== "") {
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
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />
      <Scripts />
      <LiveReload />
    </>
  );
}
