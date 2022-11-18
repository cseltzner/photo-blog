import { rest } from "msw";
import { apiProxy } from "../utils/apiProxy";

export const handlers = [
  // Example to ensure that msw is working properly. Delete later
  rest.get(apiProxy.concat("/example"), (req, res, ctx) => {
    return res(ctx.json({ number: "1" }));
  }),
];
