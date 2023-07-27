import type { V2_MetaFunction } from "@remix-run/node";
import Articles from "./Articles";

export const meta: V2_MetaFunction = () => {
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
