import type { MetaFunction } from "@remix-run/node";

import About from "./About";

export const meta: MetaFunction = () => {
  return [
    { title: "About Me" },
    {
      property: "og:title",
      content: "About Me",
    },
    {
      name: "description",
      content: "I'm David, a full-stack software engineer.",
    },
  ];
};
export default About;
