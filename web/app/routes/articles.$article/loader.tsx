import type { LoaderFunctionArgs } from "@remix-run/node";
import { articleData } from "~/data/articles";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const data = articleData[params.article as keyof typeof articleData];
  if (!data) {
    throw new Response("Not found", {
      status: 404,
    });
  }
  return data;
};
