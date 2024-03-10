import type { MetaFunction } from "@remix-run/node";

import Melee from "./Melee";

export const meta: MetaFunction = () => {
  return [
    { title: "Melee" },
    {
      property: "og:title",
      content: "Melee",
    },
    {
      name: "description",
      content:
        "After picking up the game competitively back in late 2014, David “R2DLiu” Liu quickly rose to prominence...",
    },
  ];
};

export default Melee;
