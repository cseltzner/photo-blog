import { render, screen } from "@testing-library/react";
import Contact from "../../../pages/contact";
import { contactStrings as strings } from "../../../strings/pages/contactStrings";

describe("Contact page", () => {
  test("page title changes on page load", () => {
    render(<Contact />);

    expect(document.title).toBe(strings.html_pageTitle);
  });

  test("should display correct email address", () => {
    const correctEmail = "chase.seltz21@gmail.com";

    render(<Contact />);

    const emailLink = screen.getByRole("link", { name: correctEmail });
    expect(emailLink).toBeInTheDocument();
  });

  test("component renders correctly, with all headers and links present and correct", () => {
    const correctEmail = "chase.seltz21@gmail.com";

    render(<Contact />);

    const mainHeader = screen.getByRole("heading", {
      name: strings.html_mainHeader,
    });
    expect(mainHeader).toBeInTheDocument();

    const emailHeader = screen.getByRole("heading", {
      name: strings.html_contactHeader1,
    });
    expect(emailHeader).toBeInTheDocument();

    const emailLink = screen.getByRole("link", { name: correctEmail });
    expect(emailLink).toBeInTheDocument();

    const githubHeader = screen.getByRole("heading", {
      name: strings.html_contactHeader2,
    });
    expect(githubHeader).toBeInTheDocument();

    const githubLink = screen.getByRole("link", {
      name: strings.html_githubLink,
    }) as HTMLAnchorElement;
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.href).toBe(strings.html_githubLinkHref);
  });
});
