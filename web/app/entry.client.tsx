/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/docs/en/main/file-conventions/entry.client
 */

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <title>Oops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
    </html>
  );
}

startTransition(() => {
  const client = new ApolloClient({
    // @ts-expect-error __APOLLO_STATE__ should exist. see entry.server.tsx
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    uri: "http://localhost:8000/graphql",
  });

  hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <ApolloProvider client={client}>
        <RemixBrowser />
      </ApolloProvider>
    </StrictMode>,
  );
});
