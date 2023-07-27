import type { V2_MetaFunction } from "@remix-run/node";
import About from "./About";

export const meta: V2_MetaFunction = () => {
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
