import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../../../components/navbar/Navbar";
import { navbarStrings as strings } from "../../../strings/components/navbar/navbarStrings";
import { categories } from "../../../resources/links";
import AuthContextTestProvider from "../../test-utils/context/AuthContextTestProvider";
import { useRouter } from "next/router";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { apiProxy } from "../../../utils/apiProxy";

// Stub out router.push()
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const push = jest.fn();
(useRouter as jest.Mock).mockImplementation(() => ({
  push,
}));

describe("navbar component", () => {
  describe("No auth token", () => {
    test("component renders correctly", () => {
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );

      const navbar = screen.getByRole("navigation", {
        name: "full screen navigation bar",
      });
      expect(navbar).toBeInTheDocument();

      const logo = screen.getByAltText(strings.html_logoAlt);
      expect(logo).toBeInTheDocument();

      const mainLinksList = screen.getByRole("list", {
        name: strings.html_mainNavigationLinksLabel,
      });
      expect(mainLinksList).toBeInTheDocument();
    });

    test("component renders all large-screen links by default", () => {
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );

      // TailwindCSS classes such as "hidden" are not applied in RTL.
      // This means that all links are duplicated, once for large screens and once for small screens.
      // To query large screen links, use getByRole(...)[0], and for small screen links use getByRole(...)[1]
      const homeLink = screen.getAllByRole("link", {
        name: strings.html_navHome,
      })[0] as HTMLAnchorElement;
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.href).toBe("http://localhost" + strings.html_navHomeHref);

      categories.forEach((category, index) => {
        const categoryLink = screen.getAllByRole("link", {
          name: category,
        })[0] as HTMLAnchorElement;
        expect(categoryLink).toBeInTheDocument();
        expect(categoryLink.href).toBe(
          `http://localhost/gallery/${category.toLowerCase()}`
        );
      });

      const favoritesLink = screen.getAllByRole("link", {
        name: strings.html_navFavorites,
      })[0] as HTMLAnchorElement;
      expect(favoritesLink).toBeInTheDocument();
      expect(favoritesLink.href).toBe(
        "http://localhost" + strings.html_navFavoritesHref
      );

      const aboutLink = screen.getAllByRole("link", {
        name: strings.html_navAbout,
      })[0] as HTMLAnchorElement;
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink.href).toBe(
        "http://localhost" + strings.html_navAboutHref
      );

      const contactLink = screen.getAllByRole("link", {
        name: strings.html_navContact,
      })[0] as HTMLAnchorElement;
      expect(contactLink).toBeInTheDocument();
      expect(contactLink.href).toBe(
        "http://localhost" + strings.html_navContactHref
      );
    });

    test("component renders all small-screen links by default", () => {
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );
      Object.assign(window, { innerWidth: 500 });

      // TailwindCSS classes such as "hidden" are not applied in RTL.
      // This means that all links are duplicated, once for large screens and once for small screens.
      // To query large screen links, use getByRole(...)[0], and for small screen links use getByRole(...)[1]
      const homeLink = screen.getAllByRole("link", {
        name: strings.html_navHome,
      })[1] as HTMLAnchorElement;
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.href).toBe("http://localhost" + strings.html_navHomeHref);

      categories.forEach((category) => {
        const categoryLink = screen.getAllByRole("link", {
          name: category,
        })[0] as HTMLAnchorElement;
        expect(categoryLink).toBeInTheDocument();
        expect(categoryLink.href).toBe(
          `http://localhost/gallery/${category.toLowerCase()}`
        );
      });

      const favoritesLink = screen.getAllByRole("link", {
        name: strings.html_navFavorites,
      })[1] as HTMLAnchorElement;
      expect(favoritesLink).toBeInTheDocument();
      expect(favoritesLink.href).toBe(
        "http://localhost" + strings.html_navFavoritesHref
      );

      const aboutLink = screen.getAllByRole("link", {
        name: strings.html_navAbout,
      })[1] as HTMLAnchorElement;
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink.href).toBe(
        "http://localhost" + strings.html_navAboutHref
      );

      const contactLink = screen.getAllByRole("link", {
        name: strings.html_navContact,
      })[1] as HTMLAnchorElement;
      expect(contactLink).toBeInTheDocument();
      expect(contactLink.href).toBe(
        "http://localhost" + strings.html_navContactHref
      );
    });

    test("admin tab is not displayed on large screens when not logged in", () => {
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );

      // Ensure that navbar is rendered
      const navbar = screen.getByRole("navigation", {
        name: "full screen navigation bar",
      });
      expect(navbar).toBeInTheDocument();

      const adminTab = screen.queryByLabelText(
        strings.html_adminNavigationLabel
      );
      expect(adminTab).not.toBeInTheDocument();
    });

    test("admin tab is not displayed on small screens when not logged in", () => {
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );
      Object.assign(window, { innerWidth: 500 });

      const logoutButton = screen.queryByRole("button", {
        name: "small screen admin tab",
      });
      expect(logoutButton).not.toBeInTheDocument();
    });

    test("navigation menu is visible on small screens when the hamburger button is pressed", async () => {
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );
      Object.assign(window, { innerWidth: 500 });

      const navigationMenu = screen.getByLabelText(/^navigation menu$/i);
      expect(navigationMenu).toHaveClass("opacity-0");

      const hamburgerButton = screen.getByLabelText(
        /navigation menu open button/i
      );
      await userEvent.click(hamburgerButton);

      expect(navigationMenu).not.toHaveClass("opacity-0");
    });
  });
  describe("Given auth token present", () => {
    const testToken = "valid token";
    beforeEach(() => {
      localStorage.setItem("token", testToken);
    });
    afterEach(() => {
      localStorage.clear();
      push.mockClear();
    });

    test("admin tab is displayed if valid auth token is present", async () => {
      // Returns 200 response
      server.use(
        rest.get(apiProxy.concat("/user"), (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );

      const adminTab = await screen.findByLabelText(
        strings.html_adminNavigationLabel
      );
      expect(adminTab).toBeInTheDocument();
    });

    test("logging out removes auth token from localstorage", async () => {
      // Returns 200 response
      server.use(
        rest.get(apiProxy.concat("/user"), (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );

      expect(localStorage.getItem("token")).toBe(testToken);

      const logoutButton = await screen.findByRole("button", {
        name: strings.html_navLogout,
      });
      await userEvent.click(logoutButton);
      expect(localStorage.getItem("token")).toBeFalsy();
    });

    test("logging out stops admin tab from displaying", async () => {
      // Returns 200 response
      server.use(
        rest.get(apiProxy.concat("/user"), (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      render(
        <AuthContextTestProvider>
          <Navbar />
        </AuthContextTestProvider>
      );

      const adminTab = await screen.findByLabelText(
        strings.html_adminNavigationLabel
      );
      expect(adminTab).toBeInTheDocument();

      const logoutButton = await screen.findByRole("button", {
        name: strings.html_navLogout,
      });
      await userEvent.click(logoutButton);

      expect(adminTab).not.toBeInTheDocument();
    });
  });
});

export {};
