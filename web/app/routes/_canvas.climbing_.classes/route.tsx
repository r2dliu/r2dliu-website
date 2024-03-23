import type { MetaFunction } from "@remix-run/node";

import Classes from "./Classes";

export const meta: MetaFunction = () => {
  return [
    { title: "Classes" },
    {
      property: "og:title",
      content: "Classes",
    },
    {
      name: "description",
      content: "Fitness classes at Movement Columbia",
    },
  ];
};
export default Classes;
