import { render, screen } from "@testing-library/react";
import { _404Strings as strings } from "../../strings/pages/404Strings";
import Custom404 from "../../pages/404";

describe("404 page", () => {
  test("title changes on page load", () => {
    render(<Custom404 />);
    expect(document.title).toBe(strings.html_pageTitle);
  });

  test("component renders properly", () => {
    render(<Custom404 />);

    const mainHeading = screen.getByRole("heading", {
      name: strings.html_mainHeader,
    });
    expect(mainHeading).toBeInTheDocument();

    const mainText = screen.getByText(strings.html_mainText);
    expect(mainText).toBeInTheDocument();

    const link = screen.getByRole("link", {
      name: strings.html_returnLink,
    }) as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    const expectedHref = "http://localhost".concat(strings.html_returnLinkHref);
    expect(link.href).toBe(expectedHref);

    const image = screen.getByRole("img") as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.alt).toBe(strings.html_imgAlt);
  });
});
