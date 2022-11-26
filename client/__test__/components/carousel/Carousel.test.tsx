import { render, screen } from "@testing-library/react";
import { testImages } from "../../test-utils/testImages";
import Carousel from "../../../components/carousel/Carousel";

const testUrls = testImages.map((img) => img.img_url);

describe("carousel component", () => {
  test("renders correctly", () => {
    render(<Carousel imgUrls={testUrls} />);

    const carousel = screen.getByLabelText(/^photo carousel$/i);
    expect(carousel).toBeInTheDocument();

    const carouselControls = screen.getAllByRole("button");
    expect(carouselControls).toHaveLength(2);
  });

  test("renders correct number of images", () => {
    render(<Carousel imgUrls={testUrls} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(testUrls.length);
  });

  test("renders no images if no images are passed in", () => {
    render(<Carousel imgUrls={[]} />);

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);
  });
});

export {};
