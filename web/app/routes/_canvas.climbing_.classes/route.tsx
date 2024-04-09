import type { MetaFunction } from "@remix-run/node";
import moment from "moment";

import Classes from "./Classes";

export const loader = async () => {
  const timestamp = moment().subtract(1, "days").toISOString(false);
  return timestamp;
};

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
