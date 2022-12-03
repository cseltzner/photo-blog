import { updatePhotoQuery } from "../../../../db/queries/images/update-photo-query";

describe("update photo query", () => {
  test("returns correctly when categories present", () => {
    const photoId = "1";
    const title = "title";
    const description = "description";
    const favorite = "true";
    const front = "true";
    const categories = ["plants", "animals"];

    const expectedQuery =
      "UPDATE images SET title = 'title', description = 'description', favorite = 'true', front_page = 'true', categories = ARRAY ['plants', 'animals'] WHERE id = '1'";
    const resultQuery = updatePhotoQuery(
      photoId,
      title,
      description,
      favorite,
      front,
      categories
    );

    expect(resultQuery).toBe(expectedQuery);
  });

  test("returns correctly when no categories present", () => {
    const photoId = "1";
    const title = "title";
    const description = "description";
    const favorite = "true";
    const front = "true";
    const categories: Array<string> = [];

    const expectedQuery =
      "UPDATE images SET title = 'title', description = 'description', favorite = 'true', front_page = 'true', categories = ARRAY [] WHERE id = '1'";
    const resultQuery = updatePhotoQuery(
      photoId,
      title,
      description,
      favorite,
      front,
      categories
    );

    expect(resultQuery).toBe(expectedQuery);
  });
});
