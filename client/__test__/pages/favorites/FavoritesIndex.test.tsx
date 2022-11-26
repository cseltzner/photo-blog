import FavoritesPage from "../../../pages/favorites";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AlertContextTestProvider from "../../test-utils/context/AlertContextTestProvider";
import { favoritesStrings as strings } from "../../../strings/components/favorites/favoritesStrings";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { apiProxy } from "../../../utils/apiProxy";
import { testImages } from "../../test-utils/testImages";

describe("Favorites index page", () => {
  beforeEach(() => {
    server.use(
      rest.get(apiProxy.concat("/photos"), (req, res, ctx) => {
        return res.once(ctx.json(testImages));
      })
    );

    render(
      <AlertContextTestProvider>
        <FavoritesPage />
      </AlertContextTestProvider>
    );
  });

  test("title changes on page load", () => {
    expect(document.title).toBe(strings.html_pageTitle);
  });

  test("page renders correctly", async () => {
    const mainHeading = screen.getByRole("heading", {
      name: strings.html_mainHeader,
    });
    expect(mainHeading).toBeInTheDocument();

    const imageListItems = await screen.findAllByRole("listitem");
    expect(imageListItems).toHaveLength(testImages.length);

    const imageLinks: Array<HTMLAnchorElement> = await screen.findAllByRole(
      "link"
    );
    expect(imageLinks).toHaveLength(testImages.length);
    imageLinks.forEach((link, index) => {
      expect(link.href).toBe(
        `http://localhost/favorites/${testImages[index].id}`
      );
    });

    const images = await screen.findAllByAltText(strings.img_alt);
    expect(images).toHaveLength(testImages.length);

    const dates = await screen.findAllByTestId(strings.html_dateTestId);
    expect(dates).toHaveLength(testImages.length);
    dates.forEach((date, index) => {
      const dateString =
        testImages[index].test__month +
        " " +
        testImages[index].test__day +
        " " +
        testImages[index].test__year;
      expect(date).toHaveTextContent(dateString);
    });

    const imageTitles = await screen.findAllByRole("heading", { level: 4 });
    expect(imageTitles).toHaveLength(testImages.length);
    imageTitles.forEach((title, index) => {
      expect(title).toHaveTextContent(testImages[index].title);
    });
  });

  test("loading spinner shows until data is fetched", async () => {
    const loadingSpinner = await screen.findByRole("progressbar");
    expect(loadingSpinner).toBeInTheDocument();

    // Wait for data to be fetched
    const imageListItems = await screen.findAllByRole("listitem");
    expect(imageListItems).toHaveLength(testImages.length);

    expect(loadingSpinner).not.toBeInTheDocument();
  });

  test("non-200 responses generates an alert error", async () => {
    cleanup();
    // returns 500 status
    server.use(
      rest.get(apiProxy.concat("/photos"), (req, res, ctx) => {
        return res.once(ctx.status(500));
      })
    );
    render(
      <AlertContextTestProvider>
        <FavoritesPage />
      </AlertContextTestProvider>
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const alertText = await screen.findAllByRole("listitem");
    expect(alertText.length).toBe(1);
    expect(alertText[0]).toHaveTextContent(strings.alert_networkError);
  });
});

export {};
