import { categories } from "../../../resources/links";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { apiProxy } from "../../../utils/apiProxy";
import { useRouter } from "next/router";
import AlertContextTestProvider from "../../test-utils/context/AlertContextTestProvider";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import SingleFavoritePage from "../../../pages/favorites/[photoId]";
import { favoriteStrings as strings } from "../../../strings/components/favorites/favoriteStrings";
import { _404Strings } from "../../../strings/pages/404Strings";

const testPhoto = {
  id: 1,
  img_url: "https://fake.imagesource.com/abcde/image/upload/123/abc/abc.jpg",
  title: "test title",
  description: "test description",
  date_added: "2022-11-06 08:12:34.165627+07",
  categories: [categories[0].toLowerCase(), categories[1].toLowerCase()],
  test__month: "November",
  test__day: "05",
  test__year: 2022,
};

// Stub out NextJS router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
let photoId = 1;
(useRouter as jest.Mock).mockImplementation(() => ({
  query: {
    photoId: photoId,
  },
}));

describe("Single favorite page", () => {
  beforeEach(() => {
    server.use(
      rest.get(apiProxy.concat("/photo/:photoId"), (req, res, ctx) => {
        return res(ctx.json(testPhoto));
      })
    );

    render(
      <AlertContextTestProvider>
        <SingleFavoritePage />
      </AlertContextTestProvider>
    );
  });

  afterEach(() => {
    photoId = 1;
  });

  test("page title changes on page load", async () => {
    // Wait for loading to end and image to load
    const loadingSpinner = await screen.findByTestId(
      strings.html_spinnerTestId
    );
    expect(loadingSpinner).toHaveClass("scale-100");
    await waitFor(() => {
      expect(loadingSpinner).toHaveClass("scale-0");
    });
    await waitFor(() => {
      expect(document.title).toBe(strings.html_pageTitle(testPhoto.title));
    });
  });

  test("page renders correctly", async () => {
    // Wait for loading to end and image to load
    const loadingSpinner = await screen.findByTestId(
      strings.html_spinnerTestId
    );
    expect(loadingSpinner).toHaveClass("scale-100");
    await waitFor(() => {
      expect(loadingSpinner).toHaveClass("scale-0");
    });

    const mainHeading = await screen.findByRole("heading", {
      name: testPhoto.title,
    });
    expect(mainHeading).toBeInTheDocument();

    const dateString =
      testPhoto.test__month +
      " " +
      testPhoto.test__day +
      " " +
      testPhoto.test__year;
    const dateEl = await screen.findByText(dateString);
    expect(dateEl).toBeInTheDocument();

    const categoriesListItems = (await screen.findAllByTestId(
      strings.html_categoryLiTestId
    )) as Array<HTMLAnchorElement>;
    expect(categoriesListItems).toHaveLength(testPhoto.categories.length);
    categoriesListItems.forEach((li, index) => {
      expect(li).toHaveTextContent(testPhoto.categories[index]);
      expect(li.href).toBe(
        `http://localhost/gallery/${testPhoto.categories[index].toLowerCase()}`
      );
    });

    const imageHref = (await screen.findByTestId(
      strings.html_imgHref
    )) as HTMLAnchorElement;
    expect(imageHref.href).toBe(testPhoto.img_url);

    const image = (await screen.findByRole("img")) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.alt).toBe(testPhoto.title);
    expect(image.src).toBe(testPhoto.img_url);

    const description = await screen.findByText(testPhoto.description);
    expect(description).toBeInTheDocument();
  });

  test("spinner is present on page load and disappears when data is loaded", async () => {
    const loadingSpinner = await screen.findByTestId(
      strings.html_spinnerTestId
    );
    expect(loadingSpinner).toHaveClass("scale-100");
    await waitFor(() => {
      expect(loadingSpinner).toHaveClass("scale-0");
    });
  });

  test("if photo is not found the 404 page will be shown", async () => {
    cleanup();
    // Returns 404 status
    server.use(
      rest.get(apiProxy.concat("/photo/:photoId"), (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    render(
      <AlertContextTestProvider>
        <SingleFavoritePage />
      </AlertContextTestProvider>
    );

    const _404Header = await screen.findByRole("heading", {
      name: _404Strings.html_mainHeader,
    });
    expect(_404Header).toBeInTheDocument();
  });

  test("network error will generate alert error", async () => {
    cleanup();
    // Returns nothing
    server.use(
      rest.get(apiProxy.concat("/photo/:photoId"), (req, res, ctx) => {
        throw new Error();
      })
    );

    render(
      <AlertContextTestProvider>
        <SingleFavoritePage />
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
