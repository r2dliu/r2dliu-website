import type { V2_MetaFunction } from "@remix-run/node";
import Climbing from "./Climbing";

export const meta: V2_MetaFunction = () => {
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
