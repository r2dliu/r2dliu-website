import type { MetaFunction } from "@remix-run/node";
import Article from "./Article";
import type { loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [
    { title: data?.title },
    {
      property: "og:title",
      content: data?.title,
    },
    {
      name: "description",
      content: data?.description,
    },
    {
      property: "og:image",
      content: data?.image,
    },
    { property: "og:url", content: location.pathname },
    { property: "article:author", content: "https://r2dliu.com" },
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1.0",
    },
    { charSet: "utf-8" },
  ];
};

export default Article;
