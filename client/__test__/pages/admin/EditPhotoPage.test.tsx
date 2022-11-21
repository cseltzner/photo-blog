// Stub out router.push()
import { useRouter } from "next/router";
import { render, screen, waitFor } from "@testing-library/react";
import AuthContextTestProvider from "../../test-utils/context/AuthContextTestProvider";
import AlertContextTestProvider from "../../test-utils/context/AlertContextTestProvider";
import EditPhotoPage from "../../../pages/admin/edit/[photoId]";
import { editImageStrings as strings } from "../../../strings/components/admin/editImageStrings";
import { categories } from "../../../resources/links";
import userEvent from "@testing-library/user-event";
import { handlerStrings } from "../../../mocks/handlers";

// Stub out router.push()
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const push = jest.fn();
(useRouter as jest.Mock).mockImplementation(() => ({
  push,
  query: {
    photoId: 1,
  },
}));

describe("Edit photo page", () => {
  describe("Tests without a login token", () => {
    afterEach(() => {
      push.mockClear();
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
      jest.setTimeout(1000000); // remove me
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
  });
});
