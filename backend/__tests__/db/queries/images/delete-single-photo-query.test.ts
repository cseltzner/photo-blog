import { deleteSinglePhotoQuery } from "../../../../db/queries/images/delete-single-photo-query";

describe("delete single photo query", () => {
  test("returns correctly", () => {
    const photoId = "testID";

    const expectedQuery = "DELETE FROM images WHERE id = 'testID'";
    const resultQuery = deleteSinglePhotoQuery(photoId);

    expect(resultQuery).toBe(expectedQuery);
  });
});
