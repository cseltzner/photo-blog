import { rest } from "msw";
import { apiProxy } from "../utils/apiProxy";
import { categories } from "../resources/links";

export const handlers = [
  // Example to ensure that msw is working properly. Delete later
  rest.get(apiProxy.concat("/example"), (req, res, ctx) => {
    return res(ctx.json({ number: "1" }));
  }),
  rest.get(apiProxy.concat("/photo/:photoId"), (req, res, ctx) => {
    return res(
      ctx.json({
        img_url: handlerStrings.GETphoto_img_url,
        title: handlerStrings.GETphoto_title,
        description: handlerStrings.GETphoto_description,
        favorite: handlerStrings.GETphoto_favorite,
        front_page: handlerStrings.GETphoto_front_page,
        categories: handlerStrings.GETphoto_categories,
      })
    );
  }),
];

export const handlerStrings = {
  // GET /photo - dummy strings
  GETphoto_img_url: "img_url",
  GETphoto_title: "title",
  GETphoto_description: "description",
  GETphoto_favorite: true,
  GETphoto_front_page: true,
  GETphoto_categories: [categories[0], categories[1]],
};
