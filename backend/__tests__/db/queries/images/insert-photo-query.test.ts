import { insertPhotoQuery } from "../../../../db/queries/images/insert-photo-query";

describe("insert photo query", () => {
  test("returns correctly if categories present", () => {
    const id = "id";
    const c_id = "c_id";
    const title = "title";
    const description = "description";
    const url = "url";
    const favorite = "true";
    const front = "true";
    const categories = ["plants", "animals"];

    const expectedQuery =
      /^INSERT INTO images \(id, cloudinary_public_id, title, description, img_url, favorite, front_page, categories\)\s* VALUES \('id', 'c_id', 'title', 'description', 'url', 'true', 'true', ARRAY \['plants', 'animals']\)$/;
    const resultQuery = insertPhotoQuery(
      id,
      c_id,
      title,
      description,
      url,
      favorite,
      front,
      categories
    );
    expect(resultQuery).toMatch(expectedQuery);
  });

  test("returns correctly if no categories are present", () => {
    const id = "id";
    const c_id = "c_id";
    const title = "title";
    const description = "description";
    const url = "url";
    const favorite = "true";
    const front = "true";
    const categories: Array<string> = [];

    const expectedQuery =
      /^INSERT INTO images \(id, cloudinary_public_id, title, description, img_url, favorite, front_page, categories\)\s* VALUES \('id', 'c_id', 'title', 'description', 'url', 'true', 'true', NULL\)$/;
    const resultQuery = insertPhotoQuery(
      id,
      c_id,
      title,
      description,
      url,
      favorite,
      front,
      categories
    );
    expect(resultQuery).toMatch(expectedQuery);
  });
});
