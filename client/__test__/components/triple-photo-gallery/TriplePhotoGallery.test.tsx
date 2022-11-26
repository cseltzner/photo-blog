import { render, screen } from "@testing-library/react";
import { recentFavoritesSectionStrings as strings } from "../../../strings/components/sections/recentFavoritesSectionStrings";
import TriplePhotoGallery from "../../../components/triple-photo-gallery/TriplePhotoGallery";
import { testImages as ti } from "../../test-utils/testImages";

const testImages = ti as any;

describe("Triple photo gallery", () => {
  test("renders correctly with 3 images passed in", () => {
    render(<TriplePhotoGallery images={testImages} />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(3);

    const images = screen.getAllByRole("img") as Array<HTMLImageElement>;
    expect(images).toHaveLength(3);
    images.forEach((img, index) => {
      expect(img.src).toBe(testImages[index].img_url);
      expect(img.alt).toBe(strings.html_imgAlt);
    });

    const dates = screen.getAllByLabelText("date");
    expect(dates).toHaveLength(3);
    dates.forEach((date, index) => {
      const dateString =
        testImages[index].test__month +
        " " +
        testImages[index].test__day +
        " " +
        testImages[index].test__year;
      expect(date).toHaveTextContent(dateString);
    });

    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(3);
    headings.forEach((heading, index) => {
      expect(heading).toHaveTextContent(testImages[index].title);
    });

    const links = screen.getAllByRole("link") as Array<HTMLAnchorElement>;
    expect(links).toHaveLength(3);
    links.forEach((link, index) => {
      expect(link.href).toBe(
        `http://localhost/favorites/${testImages[index].id}`
      );
    });
  });

  test("renders correctly when only 2 images are given", () => {
    const twoImages = [testImages[0], testImages[1]];
    render(<TriplePhotoGallery images={twoImages} />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(2);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
  });

  test("renders empty div when no images are given", () => {
    render(<TriplePhotoGallery images={[]} />);

    const articles = screen.queryAllByRole("article");
    expect(articles).toHaveLength(0);
  });
});

export {};
