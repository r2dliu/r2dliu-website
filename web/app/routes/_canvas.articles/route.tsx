import type { MetaFunction } from "@remix-run/node";

import Articles from "./Articles";

export const meta: MetaFunction = () => {
  return [
    { title: "Articles" },
    {
      property: "og:title",
      content: "Articles",
    },
    {
      name: "description",
      content: "Articles and blog posts about various subjects",
    },
  ];
};

export default Articles;
