import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { uploadImageStrings as strings } from "../../../strings/components/admin/uploadImageStrings";
import { useRouter } from "next/router";
import AuthContextTestProvider from "../../test-utils/context/AuthContextTestProvider";
import AlertContextTestProvider from "../../test-utils/context/AlertContextTestProvider";
import Upload from "../../../pages/admin/upload";
import { categories } from "../../../resources/links";
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

describe("Upload photo page", () => {
  describe("Tests without a login token", () => {
    afterEach(() => {
      push.mockClear();
    });
    test("user is routed away if not logged in", async () => {
      render(<Upload />);
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
            <Upload />
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

    test("component renders correctly", () => {
      const svgIcon = screen.getByLabelText(strings.html_imgLabel);
      expect(svgIcon).toBeInTheDocument();

      const mainHeading = screen.getByRole("heading", {
        name: strings.html_mainHeader,
      });
      expect(mainHeading).toBeInTheDocument();

      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      expect(fileInput).toBeInTheDocument();

      const noFileSelectedText = screen.getByText(strings.html_noFileError);
      expect(noFileSelectedText).toBeInTheDocument();

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

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeInTheDocument();
    });

    test("submit button is disabled on initial render", () => {
      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeDisabled();
    });

    test("submit button is disabled until a file is present", async () => {
      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeDisabled();

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      expect(submitButton).toBeEnabled();
    });

    test("submit button is disabled if favorite is checked AND no title/description is present, regardless of file presence", async () => {
      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeDisabled();

      // Check the favorites checkbox
      const favoriteCheckbox = screen.getByLabelText(
        strings.html_favoriteLabel
      );
      await userEvent.click(favoriteCheckbox);

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      expect(submitButton).toBeDisabled();

      // Enter a title and description
      const titleInput = screen.getByLabelText(strings.html_titleLabel);
      await userEvent.type(titleInput, "test title");

      expect(submitButton).toBeDisabled();

      const descriptionInput = screen.getByLabelText(
        strings.html_descriptionLabel
      );
      await userEvent.type(descriptionInput, "test description");
      expect(submitButton).toBeEnabled();
    });

    test("button is disabled if filesize is too large", async () => {
      // Upload a large file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);

      const fileToUpload = new File([], "", { type: "image/png" });
      Object.defineProperty(fileToUpload, "size", {
        value: strings.maxFileSize * 2,
      });

      await userEvent.upload(fileInput, fileToUpload);

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      expect(submitButton).toBeDisabled();
    });

    test("error hint is displayed if filesize is too large", async () => {
      // Upload a large file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);

      const fileToUpload = new File([], "", { type: "image/png" });
      Object.defineProperty(fileToUpload, "size", {
        value: strings.maxFileSize * 2,
      });

      await userEvent.upload(fileInput, fileToUpload);

      const fileSizeTooLargeText = await screen.findByText(
        strings.html_fileSizeTooLargeError,
        { exact: false }
      );
      expect(fileSizeTooLargeText).toBeInTheDocument();

      const noFileSelectedText = screen.queryByText(strings.html_noFileError);
      expect(noFileSelectedText).not.toBeInTheDocument();
    });

    test("title and description error hints are displayed if photo is a favorite without a title or description", async () => {
      // Check the favorites checkbox
      const favoriteCheckbox = screen.getByLabelText(
        strings.html_favoriteLabel
      );
      await userEvent.click(favoriteCheckbox);

      const titleErrorHint = await screen.findByText(
        strings.html_invalidTitleError
      );
      expect(titleErrorHint).not.toHaveClass("opacity-0");

      const descriptionErrorHint = await screen.findByText(
        strings.html_invalidDescriptionError
      );
      expect(descriptionErrorHint).not.toHaveClass("opacity-0");

      // Entering a title and description should remove the error hints
      const titleInput = screen.getByLabelText(strings.html_titleLabel);
      await userEvent.type(titleInput, "test title");
      expect(titleErrorHint).toHaveClass("opacity-0");

      const descriptionInput = screen.getByLabelText(
        strings.html_descriptionLabel
      );
      await userEvent.type(descriptionInput, "test description");
      expect(descriptionErrorHint).toHaveClass("opacity-0");
    });

    test("loading spinner is shown while form is sending and disappears when data is returned", async () => {
      // Return generic success response
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          return res.once(ctx.json({ url: "fakeUrl" }));
        })
      );

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      const loadingSpinner = await screen.findByRole("progressbar");
      expect(loadingSpinner).toBeInTheDocument();

      const loadingSpinnerShouldDisappear = screen.queryByRole("progressbar");
      await waitFor(() => {
        expect(loadingSpinnerShouldDisappear).not.toBeInTheDocument();
      });
    });

    test("submit button is disabled as soon as data is sent", async () => {
      // Return generic success response
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          return res.once(ctx.json({ url: "fakeUrl" }));
        })
      );

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    test("bad request error generates alert error", async () => {
      // Return 400
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          return res.once(ctx.status(400));
        })
      );

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      const alert = await screen.findByTestId("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-error");

      const alertText = await screen.getAllByTestId("alert-listitem");
      expect(alertText.length).toBe(1);
      expect(alertText[0]).toHaveTextContent(strings.alert_badRequest);
    });

    test("server error generates alert error", async () => {
      // Return 500
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          return res.once(ctx.status(500));
        })
      );

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      const alert = await screen.findByTestId("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-error");

      const alertText = await screen.getAllByTestId("alert-listitem");
      expect(alertText.length).toBe(1);
      expect(alertText[0]).toHaveTextContent(strings.alert_serverError);
    });

    test("network error generates alert error", async () => {
      // Return nothing
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          throw new Error();
        })
      );

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      const alert = await screen.findByTestId("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-error");

      const alertText = await screen.getAllByTestId("alert-listitem");
      expect(alertText.length).toBe(1);
      expect(alertText[0]).toHaveTextContent(strings.alert_networkError);
    });

    test("successful upload generates success alert", async () => {
      // Return url
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          return res.once(ctx.json({ url: "testUrl" }));
        })
      );

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      const alert = await screen.findByTestId("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("id", "alert-success");

      const alertTitle = await screen.findByText(
        strings.alert_photoUploadTitle
      );
      expect(alertTitle).toBeInTheDocument();

      const alertText = await screen.findByText(strings.alert_photoUpload);
      expect(alertText).toBeInTheDocument();
    });

    test("form is cleared after successful submission", async () => {
      // Return url
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          return res.once(ctx.json({ url: "testUrl" }));
        })
      );

      const categoriesListItems = screen.getAllByTestId(
        strings.html_categoriesListItemTestId
      );

      const favoriteCheckbox = screen.getByLabelText(
        strings.html_favoriteLabel
      );

      const frontPageCheckbox = screen.getByLabelText(
        strings.html_frontPageLabel
      );

      const titleInput = screen.getByLabelText(strings.html_titleLabel);

      const descriptionInput = screen.getByLabelText(
        strings.html_descriptionLabel
      );

      // Upload a file, check all of the checkboxes, and enter text in the inputs
      const fileInput = screen.getByLabelText(
        strings.html_uploadHint
      ) as HTMLInputElement;
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      for (const item of categoriesListItems) {
        await userEvent.click(item);
        expect(item).toBeChecked();
      }

      await userEvent.click(favoriteCheckbox);
      expect(favoriteCheckbox).toBeChecked();

      await userEvent.click(frontPageCheckbox);
      expect(frontPageCheckbox).toBeChecked();

      await userEvent.type(titleInput, "test title");
      await userEvent.type(descriptionInput, "test description");

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      // Expect inputs to be unchecked and blank
      const noCurrentFileText = await screen.findByText(
        strings.html_noFileError
      );
      expect(noCurrentFileText).toBeInTheDocument();

      for (const item of categoriesListItems) {
        await waitFor(() => {
          expect(item).not.toBeChecked();
        });
      }

      await waitFor(() => {
        expect(favoriteCheckbox).not.toBeChecked();
      });
      await waitFor(() => {
        expect(frontPageCheckbox).not.toBeChecked();
      });
      await waitFor(() => {
        expect(titleInput).toBeEmpty();
      });
      await waitFor(() => {
        expect(descriptionInput).toBeEmpty();
      });
    });

    test("uploading a file adds it to the 'files uploaded this session' list", async () => {
      // return 'fakeUrl' as a url
      server.use(
        rest.post(apiProxy.concat("/photo"), (req, res, ctx) => {
          return res.once(ctx.json({ url: "fakeUrl" }));
        })
      );

      // Upload a file
      const fileInput = screen.getByLabelText(strings.html_uploadHint);
      await userEvent.upload(
        fileInput,
        new File([], "", { type: "image/png" })
      );

      const submitButton = screen.getByRole("button", {
        name: strings.html_submitButton,
      });
      await userEvent.click(submitButton);

      const sessionUploadListItems = await screen.findAllByTestId(
        strings.html_sessionUploadLiTestId
      );
      expect(sessionUploadListItems.length).toBe(1);
      expect(sessionUploadListItems[0].textContent).toBe("fakeUrl");
    });
  });
});
