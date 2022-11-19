import { render, screen } from "@testing-library/react";
import {
  aboutStrings,
  aboutStrings as strings,
} from "../../../strings/pages/aboutStrings";
import AboutPage from "../../../pages/about";

describe("About page", () => {
  test("page title changes on page load", () => {
    render(<AboutPage />);
    expect(document.title).toBe(aboutStrings.html_pageTitle);
  });

  test("component renders with all headings, paragraphs, and links", () => {
    render(<AboutPage />);

    // Headings
    const mainHeading = screen.getByRole("heading", {
      name: strings.html_mainHeader,
    });
    expect(mainHeading).toBeInTheDocument();

    const secondaryHeading = screen.getByRole("heading", {
      name: strings.html_secondaryHeader,
    });
    expect(secondaryHeading).toBeInTheDocument();

    const tertiaryHeading = screen.getByRole("heading", {
      name: strings.html_tertiaryHeader,
    });
    expect(tertiaryHeading).toBeInTheDocument();

    // Paragraph text
    const mainParagraph = screen.getByText(strings.html_mainText);
    expect(mainParagraph).toBeInTheDocument();

    const secondaryParagraph = screen.getByText(strings.html_secondaryText);
    expect(secondaryParagraph).toBeInTheDocument();

    const tertiaryParagraph1 = screen.getByText(strings.html_tertiaryTextPar1);
    expect(tertiaryParagraph1).toBeInTheDocument();

    const tertiaryParagraph2 = screen.getByText(strings.html_tertiaryTextPar2);
    expect(tertiaryParagraph2).toBeInTheDocument();

    // Button link
    const contactButton = screen.getByRole("link", {
      name: strings.html_contactButton,
    }) as HTMLAnchorElement;
    expect(contactButton).toBeInTheDocument();

    const expectedHref = "http://localhost".concat(
      strings.html_contactButtonHref
    );
    expect(contactButton.href).toBe(expectedHref);
  });

  test("component renders with all images", () => {
    render(<AboutPage />);

    // Images
    const images = screen.getAllByRole("img") as Array<HTMLImageElement>;
    expect(images.length).toBe(2);

    expect(images[0].alt).toBe(strings.html_img1Alt);
    expect(images[1].alt).toBe(strings.html_img2Alt);
  });
});
