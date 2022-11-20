import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addUserStrings as strings } from "../../../strings/components/admin/addUserStrings";
import AddUserPage from "../../../pages/admin/user";
import AuthContextTestProvider from "../../test-utils/context/AuthContextTestProvider";
import AlertContextTestProvider from "../../test-utils/context/AlertContextTestProvider";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { apiProxy } from "../../../utils/apiProxy";
import { useRouter } from "next/router";

// Stub out router.push()
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const push = jest.fn();
(useRouter as jest.Mock).mockImplementation(() => ({
  push,
}));

describe("Add User page", () => {
  beforeEach(() => {
    render(
      <AuthContextTestProvider>
        <AlertContextTestProvider>
          <AddUserPage />
        </AlertContextTestProvider>
      </AuthContextTestProvider>
    );
  });

  test("page title changes on page load", () => {
    expect(document.title).toBe(strings.html_pageTitle);
  });

  test("component renders properly", () => {
    const svgImage = screen.getByLabelText(strings.html_imgLabel);
    expect(svgImage).toBeInTheDocument();

    const mainHeading = screen.getByRole("heading", {
      name: strings.html_mainHeader,
    });
    expect(mainHeading).toBeInTheDocument();

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);
    expect(usernameInput).toBeInTheDocument();

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);
    expect(passwordInput).toBeInTheDocument();

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );
    expect(confirmPasswordInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });
    expect(submitButton).toBeInTheDocument();
  });

  test("submit button is disabled on render", () => {
    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test("submit button is disabled until all fields are filled", async () => {
    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    // No inputs filled
    expect(submitButton).toBeDisabled();

    // only username filled
    await userEvent.type(usernameInput, testString);
    expect(submitButton).toBeDisabled();
    await userEvent.clear(usernameInput);

    // only password filled
    await userEvent.type(passwordInput, testString);
    expect(submitButton).toBeDisabled();
    await userEvent.clear(passwordInput);

    // only confirm password filled
    await userEvent.type(confirmPasswordInput, testString);
    expect(submitButton).toBeDisabled();
    await userEvent.clear(confirmPasswordInput);

    // username and password filled
    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    expect(submitButton).toBeDisabled();
    await userEvent.clear(usernameInput);
    await userEvent.clear(passwordInput);

    // username and confirm password filled
    await userEvent.type(usernameInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    expect(submitButton).toBeDisabled();
    await userEvent.clear(usernameInput);
    await userEvent.clear(confirmPasswordInput);

    // password and confirm password filled
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    expect(submitButton).toBeDisabled();
    await userEvent.clear(passwordInput);
    await userEvent.clear(confirmPasswordInput);

    // All fields filled
    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    expect(submitButton).toBeEnabled();
  });

  test("generates alert error when passwords do not match", async () => {
    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(
      confirmPasswordInput,
      testString.concat("not matching")
    );
    await userEvent.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const alertText = await screen.findAllByRole("listitem");
    expect(alertText.length).toBe(1);
    expect(alertText[0]).toHaveTextContent(strings.alert_passwordNoMatch);
  });

  test("invalid token response generates alert error", async () => {
    // Returns 401 response
    server.use(
      rest.post(apiProxy.concat("/user"), (req, res, ctx) => {
        return res.once(ctx.status(401));
      })
    );

    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    await userEvent.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const alertText = await screen.findAllByRole("listitem");
    expect(alertText.length).toBe(1);
    expect(alertText[0]).toHaveTextContent(strings.alert_unauthorized);
  });

  test("user already exists response generates alert error", async () => {
    // Returns 409 response
    server.use(
      rest.post(apiProxy.concat("/user"), (req, res, ctx) => {
        return res.once(ctx.status(409));
      })
    );

    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    await userEvent.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const alertText = await screen.findAllByRole("listitem");
    expect(alertText.length).toBe(1);
    expect(alertText[0]).toHaveTextContent(
      strings.alert_userAlreadyExists(testString)
    );
  });

  test("server error response generates alert error", async () => {
    // Returns 500 response
    server.use(
      rest.post(apiProxy.concat("/user"), (req, res, ctx) => {
        return res.once(ctx.status(500));
      })
    );

    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    await userEvent.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const alertText = await screen.findAllByRole("listitem");
    expect(alertText.length).toBe(1);
    expect(alertText[0]).toHaveTextContent(strings.alert_miscError);
  });

  test("No response generates alert error", async () => {
    // Returns no response
    server.use(
      rest.post(apiProxy.concat("/user"), (req, res, ctx) => {
        throw new Error();
      })
    );

    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    await userEvent.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const alertText = await screen.findAllByRole("listitem");
    expect(alertText.length).toBe(1);
    expect(alertText[0]).toHaveTextContent(strings.alert_connectionError);
  });

  test("successful response generates success alert", async () => {
    // Returns 200 response
    server.use(
      rest.post(apiProxy.concat("/user"), (req, res, ctx) => {
        return res.once(ctx.status(200));
      })
    );

    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    await userEvent.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveAttribute("id", "alert-success");
    expect(alert).toBeInTheDocument();

    const alertHeader = await screen.findByRole("heading", {
      name: strings.alert_userCreatedTitle,
    });
    expect(alertHeader).toBeInTheDocument();

    const alertText = await screen.findByText(strings.alert_userCreated);
    expect(alertText).toBeInTheDocument();
  });

  test("successful response routes user to home page", async () => {
    // Returns 200 response
    server.use(
      rest.post(apiProxy.concat("/user"), (req, res, ctx) => {
        return res.once(ctx.status(200));
      })
    );

    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    await userEvent.click(submitButton);

    expect(push).toBeCalled();
  });

  test("loading spinner is shown when data is being fetched and removed afterwards", async () => {
    // Returns 200 response
    server.use(
      rest.post(apiProxy.concat("/user"), (req, res, ctx) => {
        return res.once(ctx.status(200));
      })
    );

    const testString = "Test string";

    const usernameInput = screen.getByLabelText(strings.html_usernameLabel);

    const passwordInput = screen.getByLabelText(strings.html_passwordLabel);

    const confirmPasswordInput = screen.getByLabelText(
      strings.html_confirmPasswordLabel
    );

    const submitButton = screen.getByRole("button", {
      name: strings.html_submitButton,
    });

    await userEvent.type(usernameInput, testString);
    await userEvent.type(passwordInput, testString);
    await userEvent.type(confirmPasswordInput, testString);
    await userEvent.click(submitButton);

    // Spinner should be in document
    const loadingSpinner = await screen.findByRole("progressbar");
    expect(loadingSpinner).toBeInTheDocument();

    // Spinner should exit the document after data is loaded
    await waitFor(() => {
      const loadingSpinnerShouldNotBeInDocument =
        screen.queryByRole("progressbar");
      expect(loadingSpinnerShouldNotBeInDocument).not.toBeInTheDocument();
    });
  });
});
