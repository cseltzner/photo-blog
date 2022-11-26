import { render, screen } from "@testing-library/react";
import { aboutSectionStrings as strings } from "../../../strings/components/sections/aboutSectionStrings";
import AboutSection from "../../../components/sections/home/AboutSection";

describe("About section", () => {
  test("component renders correctly", () => {
    render(<AboutSection />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(strings.html_mainHeader);

    const paragraph1 = screen.getByText(strings.html_paragraph1);
    expect(paragraph1).toBeInTheDocument();

    const paragraph2 = screen.getByText(strings.html_paragraph1);
    expect(paragraph2).toBeInTheDocument();

    const aboutLink = screen.getByRole("link", {
      name: strings.html_aboutButton,
    }) as HTMLAnchorElement;
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink.href).toBe("http://localhost/about");
  });
});
