import { getCategoryString } from "../../utils/getCategoryString";

describe("getCategoryString", () => {
  test("given empty array, returns empty string", () => {
    const categories: Array<string> = [];
    const expected = "";
    const actual = getCategoryString(categories);

    expect(actual).toBe(expected);
  });

  test("given array with one item, returns correctly", () => {
    const categories = ["plants"];
    const expected = "'plants'";
    const actual = getCategoryString(categories);

    expect(actual).toBe(expected);
  });

  test("given array with multiple items, returns correctly", () => {
    const categories = ["plants", "animals", "landscape"];
    const expected = "'plants', 'animals', 'landscape'";
    const actual = getCategoryString(categories);

    expect(actual).toBe(expected);
  });

  test("given array with uppercase characters, returns lowercase string", () => {
    const categories = ["Plants", "ANimALs", "LANDSCAPE"];
    const expected = "'plants', 'animals', 'landscape'";
    const actual = getCategoryString(categories);

    expect(actual).toBe(expected);
  });
});
