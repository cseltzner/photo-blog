import { getSinglePhotoQuery } from "../../../../db/queries/images/get-single-photo-query";

describe("get single photo query", () => {
  test("returns correctly", () => {
    const photoId = "123";
    const expectedQuery = "SELECT * FROM images WHERE id = '123'";
    const resultQuery = getSinglePhotoQuery(photoId);

    expect(resultQuery).toBe(expectedQuery);
  });
});
