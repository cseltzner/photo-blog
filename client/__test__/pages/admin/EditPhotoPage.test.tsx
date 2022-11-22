// Stub out router.push()
import { useRouter } from "next/router";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AuthContextTestProvider from "../../test-utils/context/AuthContextTestProvider";
import AlertContextTestProvider from "../../test-utils/context/AlertContextTestProvider";
import EditPhotoPage from "../../../pages/admin/edit/[photoId]";
import { editImageStrings as strings } from "../../../strings/components/admin/editImageStrings";
import { categories } from "../../../resources/links";
import userEvent from "@testing-library/user-event";
import { handlerStrings } from "../../../mocks/handlers";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { apiProxy } from "../../../utils/apiProxy";

// Stub out router.push()
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const push = jest.fn();
let photoId: string | number = 200;
const back = jest.fn();
(useRouter as jest.Mock).mockImplementation(() => ({
  push,
  query: {
    photoId: photoId,
  },
  back,
}));

describe("Edit photo page", () => {
  describe("Tests without a login token", () => {
    afterEach(() => {
      push.mockClear();
      back.mockClear();
      photoId = 200;
    });
    test("user is routed away if not logged in", async () => {
      render(<EditPhotoPage />);
      await waitFor(() => {
        expect(push).toBeCalledTimes(1);
      });
    });
  });

  describe("Tests with a login token", () => {
    beforeEach(() => {
      localStorage.setItem("token", "test token");
      render(
        <AuthContextTestProvider>
          <AlertContextTestProvider>
            <EditPhotoPage />
          </AlertContextTestProvider>
        </AuthContextTestProvider>
      );
    });

    afterEach(() => {
      localStorage.clear();
      push.mockClear();
      back.mockClear();
      photoId = 200;
    });

    test("page title changes on page load", () => {
      expect(document.title).toBe(strings.html_pageTitle);
    });

    test("component renders correctly", async () => {
      const photoToBeEdited = screen.getByAltText(strings.html_imgEditPhotoAlt);
      expect(photoToBeEdited).toBeInTheDocument();

      const mainHeading = screen.getByRole("heading", {
        name: strings.html_mainHeader,
      });
      expect(mainHeading).toBeInTheDocument();

      const categoriesHeader = screen.getByRole("heading", {
        name: strings.html_categoriesHeader,
      });
      expect(categoriesHeader).toBeInTheDocument();

      const categoriesListItems = screen.getAllByTestId(
        strings.html_categoriesListItemTestId
      );
      expect(categoriesListItems.length).toBe(categories.length);

      const favoriteCheckbox = screen.getByLabelText(
        strings.html_favoriteLabel
      );
      expect(favoriteCheckbox).toBeInTheDocument();

      const frontPageCheckbox = screen.getByLabelText(
        strings.html_frontPageLabel
      );
      expect(frontPageCheckbox).toBeInTheDocument();

      const titleInput = screen.getByLabelText(strings.html_titleLabel);
      expect(titleInput).toBeInTheDocument();

      const descriptionInput = screen.getByLabelText(
        strings.html_descriptionLabel
      );
      expect(descriptionInput).toBeInTheDocument();

      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeInTheDocument();
    });

    test("component updates input fields as soon as data is fetched from server on page load", async () => {
      // For tests, default mock response defines that:
      //  - First 2 category checkboxes are checked
      //  - Favorite box is checked
      //  - Front page box is checked
      //  - Title is included
      //  - Description is included
      // See GET "/photo/:photoId" in handlers.ts

      const photoToBeEdited = await screen.findByAltText(
        strings.html_imgEditPhotoAlt
      );
      expect(photoToBeEdited).toBeInTheDocument();

      const categoriesCheckboxes = screen.getAllByTestId(
        strings.html_categoriesCheckboxTestId
      );
      await waitFor(() => {
        expect(categoriesCheckboxes[0]).toBeChecked();
        expect(categoriesCheckboxes[1]).toBeChecked();
        expect(categoriesCheckboxes[2]).not.toBeChecked();
      });

      const favoriteCheckbox = screen.getByLabelText(
        strings.html_favoriteLabel
      );
      expect(favoriteCheckbox).toBeChecked();

      const frontPageCheckbox = screen.getByLabelText(
        strings.html_frontPageLabel
      );
      expect(frontPageCheckbox).toBeChecked();

      const titleInput = screen.getByLabelText(strings.html_titleLabel);
      expect(titleInput).toHaveValue(handlerStrings.GETphoto_title);

      const descriptionInput = screen.getByLabelText(
        strings.html_descriptionLabel
      );
      expect(descriptionInput).toHaveValue(handlerStrings.GETphoto_description);
    });

    test("submit button is disabled initially before data is loaded", () => {
      const submitButtonInitial = screen.getByTestId(
        strings.html_submitButtonTestId
      );
      expect(submitButtonInitial).toBeInTheDocument();
      expect(submitButtonInitial).toBeDisabled();
    });

    test("loading spinner is present while initial image data is being fetched, and turns into an active submit button after", async () => {
      const submitButtonInitial = screen.getByTestId(
        strings.html_submitButtonTestId
      );
      expect(submitButtonInitial).toBeInTheDocument();
      expect(submitButtonInitial).toBeDisabled();

      const loadingSpinnerInitial = screen.getByRole("progressbar");
      expect(loadingSpinnerInitial).toBeInTheDocument();

      const submitButtonAfterDataFetched = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButtonAfterDataFetched).toBeInTheDocument();
      expect(submitButtonAfterDataFetched).toBeEnabled();

      const loadingSpinnerShouldBeGone = screen.queryByRole("progressbar");
      await waitFor(() => {
        expect(loadingSpinnerShouldBeGone).not.toBeInTheDocument();
      });
    });

    test("submit button is disabled if favorite is checked AND no title/description is present", async () => {
      // Initially the favorite checkbox is checked, and a title and description is present
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeEnabled(); // button is enabled because data comes back pre-filled

      // Remove the title
      const titleInput = screen.getByLabelText(
        strings.html_titleLabel
      ) as HTMLInputElement;
      await waitFor(() => {
        expect(titleInput).toHaveValue(handlerStrings.GETphoto_title);
      });
      await userEvent.clear(titleInput);

      expect(submitButton).toBeDisabled();

      // Re-add a title
      await userEvent.type(titleInput, "test title");

      expect(submitButton).toBeEnabled();

      // Remove the description
      const descriptionInput = screen.getByLabelText(
        strings.html_descriptionLabel
      );
      await userEvent.clear(descriptionInput);
      expect(submitButton).toBeDisabled();

      // Re-add a description
      await userEvent.type(descriptionInput, "test description");

      expect(submitButton).toBeEnabled();

      // Remove both title and description
      await userEvent.clear(titleInput);
      await userEvent.clear(descriptionInput);
      expect(submitButton).toBeDisabled();
    });

    test("title and description error hints are displayed if photo is a favorite without a title or description", async () => {
      // Wait for data to come back from initial load (submit button will enable and title will have a value at this point)
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeEnabled();
      const titleInput = screen.getByLabelText(
        strings.html_titleLabel
      ) as HTMLInputElement;
      // Waiting for the value to appear is necessary to avoid some hard to track flakiness with the tests!
      await waitFor(() => {
        expect(titleInput).toHaveValue(handlerStrings.GETphoto_title);
      });

      // Initially the favorite checkbox is checked, and a title and description is present
      const titleErrorHint = await screen.findByText(
        strings.html_invalidTitleError
      );
      const descriptionErrorHint = await screen.findByText(
        strings.html_invalidDescriptionError
      );
      const favoriteCheckbox = screen.getByLabelText(
        strings.html_favoriteLabel
      );

      await waitFor(() => {
        expect(titleErrorHint).toHaveClass("opacity-0");
      });
      expect(descriptionErrorHint).toHaveClass("opacity-0");

      // Remove the title
      await userEvent.clear(titleInput);

      await waitFor(() => {
        expect(titleErrorHint).not.toHaveClass("opacity-0");
      });

      // Re-add a title
      await userEvent.type(titleInput, "test title");

      expect(titleErrorHint).toHaveClass("opacity-0");

      // Remove the description
      const descriptionInput = screen.getByLabelText(
        strings.html_descriptionLabel
      );
      await userEvent.clear(descriptionInput);

      expect(descriptionErrorHint).not.toHaveClass("opacity-0");

      // Re-add a description
      await userEvent.type(descriptionInput, "test description");

      expect(descriptionErrorHint).toHaveClass("opacity-0");
    });

    test("submit button is disabled as soon as data is sent", async () => {
      // Return generic success response
      server.use(
        rest.put(apiProxy.concat("/photo/:photoId"), (req, res, ctx) => {
          return res.once(ctx.status(200));
        })
      );

      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    test("photo not found on page load generates alert error", async () => {
      // Server returns 404
      photoId = 404;

      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-error");

      const alertText = await screen.getAllByTestId("alert-listitem");
      expect(alertText.length).toBe(1);
      expect(alertText[0]).toHaveTextContent(strings.alert_miscError);
    });

    test("failure to request photo on page load generates alert error", async () => {
      cleanup();
      // Failure to fetch
      photoId = "throw";
      render(
        <AuthContextTestProvider>
          <AlertContextTestProvider>
            <EditPhotoPage />
          </AlertContextTestProvider>
        </AuthContextTestProvider>
      );

      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-error");

      const alertText = await screen.getAllByTestId("alert-listitem");
      expect(alertText.length).toBe(1);
      expect(alertText[0]).toHaveTextContent(strings.alert_networkError);
    });

    test("photo not found submission error generates alert error", async () => {
      // Returns 404
      server.use(
        rest.put(
          apiProxy.concat("/photo/").concat(photoId.toString()),
          (req, res, ctx) => {
            return res.once(ctx.status(404));
          }
        )
      );

      // Submit "updated" photo
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      await userEvent.click(submitButton);

      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-error");

      const alertText = await screen.getAllByTestId("alert-listitem");
      expect(alertText.length).toBe(1);
      expect(alertText[0]).toHaveTextContent(strings.alert_imgNotFound);
    });

    test("failed to connect submission error generates alert error", async () => {
      // Server returns nothing
      server.use(
        rest.put(
          apiProxy.concat("/photo/").concat(photoId.toString()),
          (req, res, ctx) => {
            throw new Error();
          }
        )
      );

      // Submit "updated" photo
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      await userEvent.click(submitButton);

      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-error");

      const alertText = await screen.getAllByTestId("alert-listitem");
      expect(alertText.length).toBe(1);
      expect(alertText[0]).toHaveTextContent(strings.alert_networkError);
    });

    test("successful update generates success alert", async () => {
      // returns 200 response
      server.use(
        rest.put(
          apiProxy.concat("/photo/").concat(photoId.toString()),
          (req, res, ctx) => {
            return res.once(ctx.status(200));
          }
        )
      );

      // Submit "updated" photo
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      await userEvent.click(submitButton);

      const alert = await screen.findByTestId("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-success");

      const alertTitle = await screen.findByText(strings.alert_success);
      expect(alertTitle).toBeInTheDocument();

      const alertText = await screen.findByText(strings.alert_success);
      expect(alertText).toBeInTheDocument();
    });
    test("successful update routes user to gallery page", async () => {
      // returns 200 response
      server.use(
        rest.put(
          apiProxy.concat("/photo/").concat(photoId.toString()),
          (req, res, ctx) => {
            return res.once(ctx.status(200));
          }
        )
      );

      // Submit "updated" photo
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(push).toBeCalledWith("/gallery");
      });
    });
    test("submit button becomes disabled while submitting", async () => {
      // returns 200 response
      server.use(
        rest.put(
          apiProxy.concat("/photo/").concat(photoId.toString()),
          (req, res, ctx) => {
            return res.once(ctx.status(200));
          }
        )
      );

      // Submit "updated" photo
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      await userEvent.click(submitButton);
      expect(submitButton).toBeDisabled();
    });

    test("submit button shows loading spinner when submitting", async () => {
      // returns 200 response
      server.use(
        rest.put(
          apiProxy.concat("/photo/").concat(photoId.toString()),
          (req, res, ctx) => {
            return res.once(ctx.status(200));
          }
        )
      );

      // Submit "updated" photo
      const submitButton = await screen.findByRole("button", {
        name: strings.html_submitButton,
      });
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      await userEvent.click(submitButton);

      const loadingSpinner = await screen.findByRole("progressbar");
      expect(loadingSpinner).toBeInTheDocument();
    });
  });
});
