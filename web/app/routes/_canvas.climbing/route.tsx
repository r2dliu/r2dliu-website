import type { MetaFunction } from "@remix-run/node";

import Climbing from "./Climbing";

export const meta: MetaFunction = () => {
  return [
    { title: "Climbing" },
    {
      property: "og:title",
      content: "Climbing",
    },
    {
      name: "description",
      content: "My climbing journey and personal training/coaching",
    },
  ];
};
export default Climbing;
