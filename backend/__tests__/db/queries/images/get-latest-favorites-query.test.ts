import { getLatestFavoritesQuery } from "../../../../db/queries/images/get-latest-favorites-query";

describe("get latest favorites query", () => {
  test("returns correctly", () => {
    const limit = "5";
    const expectedQuery =
      "SELECT * FROM images WHERE favorite = TRUE ORDER BY date_added DESC LIMIT 5";
    const resultQuery = getLatestFavoritesQuery(limit);

    expect(resultQuery).toBe(expectedQuery);
  });
});
