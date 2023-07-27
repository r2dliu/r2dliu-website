import type { V2_MetaFunction } from "@remix-run/node";
import Experience from "./Experience";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Experience" },
    {
      property: "og:title",
      content: "Experience",
    },
    {
      name: "description",
      content: "My professional work experience as a software engineer",
    },
  ];
};

export default Experience;
