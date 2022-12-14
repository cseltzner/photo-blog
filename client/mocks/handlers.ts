import { rest } from "msw";
import { apiProxy } from "../utils/apiProxy";
import { categories } from "../resources/links";

// Note that most msw handlers reside in the test it's being used for
export const handlers = [
  rest.get(apiProxy.concat("/photo/:photoId"), (req, res, ctx) => {
    if (req.params.photoId === "throw") {
      throw new Error();
    }
    if (req.params.photoId === "200" || !req.params.photoId) {
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
    } else {
      return res(ctx.status(Number(req.params.photoId)));
    }
  }),
];

export const handlerStrings = {
  // GET /photo - dummy strings
  GETphoto_img_url: "img_url",
  GETphoto_title: "title",
  GETphoto_description: "description",
  GETphoto_favorite: true,
  GETphoto_front_page: true,
  GETphoto_categories: [
    categories[0].toLowerCase(),
    categories[1].toLowerCase(),
  ],
};
