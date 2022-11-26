import { transformLink } from "../../utils/transformLink";

describe("transformLink() tests", () => {
  const validTestUrl =
    "https://fake.imagesource.com/cloud_name/image/upload/version/publicId/abc.jpg";

  test("transforms a link with the proper width and height transformations", () => {
    const width = 100;
    const height = 200;
    const transformedLink = transformLink(validTestUrl, width, height);

    expect(transformedLink).toBe(
      "https://fake.imagesource.com/cloud_name/image/upload/w_100,h_200/version/publicId/abc.jpg"
    );
  });

  test("transforms a link with only one transformation", () => {
    const width = 100;
    const transformedLink = transformLink(validTestUrl, width);

    expect(transformedLink).toBe(
      "https://fake.imagesource.com/cloud_name/image/upload/w_100/version/publicId/abc.jpg"
    );
  });

  test("no transformations returns the same link", () => {
    const transformedLink = transformLink(validTestUrl);
    expect(transformedLink).toBe(validTestUrl);
  });

  test("given invalid link, throws error", () => {
    const invalidUrl = "https://fake.imagesource.com/";
    const width = 200;
    expect(() => {
      transformLink(invalidUrl, width);
    }).toThrow();
  });
});

export {};
