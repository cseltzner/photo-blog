import { getAllPhotosQuery } from "../../../../db/queries/images/get-all-photos-query";

describe("get all photos query", () => {
  const orderStatement = "ORDER BY date_added DESC";

  const nullCategoriesStmt = "1 = 1";
  const nullFavoriteStmt = "favorite = favorite";
  const nullFrontStmt = "front_page = front_page";

  test("returns correctly with no arguments", () => {
    const expectedQuery = "SELECT * FROM images";
    const resultQuery = getAllPhotosQuery();

    expect(resultQuery).toBe(expectedQuery);
  });

  test("returns correctly with only categories argument", () => {
    const categories = "plants, animals";
    const expectedQuery = `SELECT * FROM images WHERE 'plants, animals' = ANY (categories) AND ${nullFavoriteStmt} AND ${nullFrontStmt} ${orderStatement}`;
    const resultQuery = getAllPhotosQuery(categories);

    expect(resultQuery).toBe(expectedQuery);
  });

  test("returns correctly with only favorite argument", () => {
    const isFavorite = "true";
    const expectedQuery = `SELECT * FROM images WHERE ${nullCategoriesStmt} AND favorite = true AND ${nullFrontStmt} ${orderStatement}`;
    const resultQuery = getAllPhotosQuery(undefined, isFavorite);

    expect(resultQuery).toBe(expectedQuery);
  });

  test("returns correctly with only front page argument", () => {
    const isFront = "true";
    const expectedQuery = `SELECT * FROM images WHERE ${nullCategoriesStmt} AND ${nullFavoriteStmt} AND front_page = true ${orderStatement}`;
    const resultQuery = getAllPhotosQuery(undefined, undefined, isFront);

    expect(resultQuery).toBe(expectedQuery);
  });

  test("returns correctly with all arguments filled", () => {
    const categories = "plants, animals";
    const isFavorite = "true";
    const isFront = "true";
    const expectedQuery = `SELECT * FROM images WHERE 'plants, animals' = ANY (categories) AND favorite = true AND front_page = true ${orderStatement}`;
    const resultQuery = getAllPhotosQuery(categories, isFavorite, isFront);

    expect(resultQuery).toBe(expectedQuery);
  });
});
